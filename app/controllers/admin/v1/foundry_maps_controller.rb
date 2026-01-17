module Admin
  module V1
    class FoundryMapsController < ApplicationController
      skip_before_action :verify_authenticity_token,
                         only: %i[file upload_files upload_image upload_package upload_chunk finalize_upload upload_thumbnail]

      # GET /v1/maps/tags
      def tags
        tags = FoundryMapTag.ordered.map(&:as_json_for_api)
        render json: tags
      end

      # GET /v1/maps/list
      def list
        maps = FoundryMap.published.recent.includes(:foundry_map_tags)
        render json: maps.map(&:as_json_for_api)
      end

      # GET /v1/maps/files/:id
      def files
        map = FoundryMap.find(params[:id])
        user_id = request.headers['Authorization']

        # Check access level for premium maps only
        if map.premium?
          # Premium maps require authentication
          return render json: { error: 'Authentication required for Premium maps' }, status: :unauthorized if user_id.blank?

          user = PatreonUser.find_by(user_id: user_id)
          return render json: { error: 'Premium access required' }, status: :forbidden unless user&.authenticated? && user.has_premium
        end

        # Free maps don't require authentication
        # Return file manifest
        files = map.foundry_map_files.map(&:as_json_for_api)
        render json: {
          mapId: map.id.to_s,
          files: files,
          totalSize: files.sum { |f| f[:size] || 0 }
        }
      end

      # POST /v1/maps/file/:id
      def file
        map = FoundryMap.find(params[:id])
        user_id = request.headers['Authorization']
        file_path = params[:path]

        # Check access level for premium maps only
        if map.premium?
          # Premium maps require authentication
          return render json: { error: 'Authentication required for Premium maps' }, status: :unauthorized if user_id.blank?

          user = PatreonUser.find_by(user_id: user_id)
          return render json: { error: 'Premium access required' }, status: :forbidden unless user&.authenticated? && user.has_premium
        end

        # Free maps don't require authentication
        # Find file
        map_file = map.foundry_map_files.find_by(file_path: file_path)
        return render json: { error: 'File not found' }, status: :not_found unless map_file

        # Generate signed URL
        signed_url = map_file.generate_signed_url(expires_in: 3600)

        # Option 1: Return signed URL for direct download
        render json: { url: signed_url }

        # Option 2: Proxy the file (uncomment if you prefer)
        # redirect_to signed_url, allow_other_host: true
      end

      # Admin endpoints below (add authorization as needed)

      # GET /v1/maps
      def index
        maps = FoundryMap.includes(:foundry_map_tags).order(created_at: :desc)
        render json: maps.map(&:as_json_for_api)
      end

      # GET /v1/maps/:id
      def show
        map = FoundryMap.find(params[:id])
        render json: map.as_json_for_api.merge(
          files: map.foundry_map_files.map(&:as_json_for_api)
        )
      end

      # POST /v1/maps
      def create
        map = FoundryMap.new(map_params)

        if map.save
          # Handle tags
          update_tags(map, params[:tags]) if params[:tags].present?

          render json: map.as_json_for_api, status: :created
        else
          render json: { errors: map.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /v1/maps/:id
      def update
        map = FoundryMap.find(params[:id])

        if map.update(map_params)
          # Handle tags
          update_tags(map, params[:tags]) if params[:tags].present?

          render json: map.as_json_for_api
        else
          render json: { errors: map.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /v1/maps/:id
      def destroy
        map = FoundryMap.find(params[:id])
        map.destroy
        head :no_content
      end

      # POST /v1/maps/:id/upload_files
      def upload_files
        map = FoundryMap.find(params[:id])

        return render json: { errors: ['No files provided'] }, status: :unprocessable_entity if params[:files].blank?

        uploaded_files = []
        errors = []

        params[:files].each do |file|
          # Upload to S3
          s3_key = "maps/#{map.id}/#{SecureRandom.uuid}_#{file.original_filename}"
          s3_client = Aws::S3::Client.new(
            region: ENV['AWS_REGION'] || 'us-east-1',
            access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
            secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil)
          )

          s3_client.put_object(
            bucket: ENV.fetch('AWS_S3_BUCKET', nil),
            key: s3_key,
            body: file.read,
            content_type: file.content_type
          )

          # Create file record
          map_file = map.foundry_map_files.create!(
            file_path: file.original_filename,
            file_type: determine_file_type(file.original_filename),
            file_size: file.size,
            s3_key: s3_key
          )

          uploaded_files << map_file.as_json_for_api
        rescue StandardError => e
          errors << "Failed to upload #{file.original_filename}: #{e.message}"
        end

        if errors.any?
          render json: { uploaded: uploaded_files, errors: errors }, status: :partial_content
        else
          render json: { uploaded: uploaded_files }, status: :created
        end
      end

      # POST /v1/maps/:id/upload_package
      def upload_package
        map = FoundryMap.find(params[:id])

        return render json: { error: 'No package file provided' }, status: :unprocessable_entity if params[:package].blank?

        begin
          process_scene_package(map, params[:package])
          render json: map.as_json_for_api.merge(
            files: map.foundry_map_files.map(&:as_json_for_api)
          ), status: :ok
        rescue StandardError => e
          Rails.logger.error "Package upload failed: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: "Failed to process package: #{e.message}" }, status: :unprocessable_entity
        end
      end

      # POST /v1/maps/:id/upload_chunk
      # Receives a chunk of a file for chunked uploads
      def upload_chunk
        map = FoundryMap.find(params[:id])

        return render json: { error: 'No chunk provided' }, status: :unprocessable_entity if params[:chunk].blank?
        return render json: { error: 'Missing upload_id' }, status: :unprocessable_entity if params[:upload_id].blank?
        return render json: { error: 'Missing chunk_index' }, status: :unprocessable_entity if params[:chunk_index].blank?
        return render json: { error: 'Missing total_chunks' }, status: :unprocessable_entity if params[:total_chunks].blank?

        upload_id = params[:upload_id]
        chunk_index = params[:chunk_index].to_i
        total_chunks = params[:total_chunks].to_i

        # Create temp directory for this upload
        upload_dir = Rails.root.join('tmp', 'chunked_uploads', map.id.to_s, upload_id)
        FileUtils.mkdir_p(upload_dir)

        # Save the chunk
        chunk_path = upload_dir.join("chunk_#{chunk_index.to_s.rjust(5, '0')}")
        File.binwrite(chunk_path, params[:chunk].read)

        # Check how many chunks we have
        existing_chunks = Dir.glob(upload_dir.join('chunk_*')).count

        render json: {
          received: chunk_index,
          total: total_chunks,
          chunks_received: existing_chunks,
          complete: existing_chunks == total_chunks
        }, status: :ok
      rescue StandardError => e
        Rails.logger.error "Chunk upload failed: #{e.message}"
        render json: { error: "Failed to upload chunk: #{e.message}" }, status: :unprocessable_entity
      end

      # POST /v1/maps/:id/finalize_upload
      # Assembles chunks and processes the package
      def finalize_upload
        map = FoundryMap.find(params[:id])

        return render json: { error: 'Missing upload_id' }, status: :unprocessable_entity if params[:upload_id].blank?
        return render json: { error: 'Missing filename' }, status: :unprocessable_entity if params[:filename].blank?

        upload_id = params[:upload_id]
        filename = params[:filename]

        upload_dir = Rails.root.join('tmp', 'chunked_uploads', map.id.to_s, upload_id)

        return render json: { error: 'Upload not found. Chunks may have expired.' }, status: :not_found unless upload_dir.exist?

        begin
          # Assemble chunks into final file
          chunk_files = Dir.glob(upload_dir.join('chunk_*')).sort
          return render json: { error: 'No chunks found' }, status: :unprocessable_entity if chunk_files.empty?

          assembled_file = upload_dir.join(filename)
          File.open(assembled_file, 'wb') do |outfile|
            chunk_files.each do |chunk_path|
              outfile.write(File.binread(chunk_path))
            end
          end

          Rails.logger.info "Assembled #{chunk_files.count} chunks into #{filename} (#{File.size(assembled_file)} bytes)"

          # Create a mock uploaded file object for process_scene_package
          uploaded_file = ActionDispatch::Http::UploadedFile.new(
            tempfile: File.open(assembled_file, 'rb'),
            filename: filename,
            type: 'application/zip'
          )

          # Process the assembled package
          process_scene_package(map, uploaded_file)

          render json: map.as_json_for_api.merge(
            files: map.foundry_map_files.map(&:as_json_for_api)
          ), status: :ok
        rescue StandardError => e
          Rails.logger.error "Finalize upload failed: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: "Failed to process package: #{e.message}" }, status: :unprocessable_entity
        ensure
          # Cleanup the upload directory
          FileUtils.rm_rf(upload_dir) if upload_dir&.exist?
        end
      end

      # POST /v1/maps/:id/upload_thumbnail
      def upload_thumbnail
        map = FoundryMap.find(params[:id])

        return render json: { error: 'No thumbnail file provided' }, status: :unprocessable_entity if params[:thumbnail].blank?

        begin
          # Upload thumbnail to S3 public path
          thumbnail_file = params[:thumbnail]
          # Use thumbnails/ prefix to match bucket policy
          s3_key = "thumbnails/maps/#{map.id}/#{SecureRandom.uuid}#{File.extname(thumbnail_file.original_filename)}"

          s3_client = Aws::S3::Client.new(
            region: ENV['AWS_REGION'] || 'us-east-1',
            access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
            secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil)
          )

          # Upload to public thumbnails path
          s3_client.put_object(
            bucket: ENV.fetch('AWS_S3_BUCKET', nil),
            key: s3_key,
            body: thumbnail_file.tempfile,
            content_type: thumbnail_file.content_type
          )

          # Generate public URL (no expiry!)
          thumbnail_url = "https://#{ENV.fetch('AWS_S3_BUCKET', nil)}.s3.#{ENV.fetch('AWS_REGION', nil)}.amazonaws.com/#{s3_key}"

          # Update map with thumbnail S3 key and URL
          map.update!(
            thumbnail_s3_key: s3_key,
            thumbnail_url: thumbnail_url
          )

          render json: map.as_json_for_api, status: :ok
        rescue StandardError => e
          Rails.logger.error "Thumbnail upload failed: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: "Failed to upload thumbnail: #{e.message}" }, status: :unprocessable_entity
        end
      end

      # POST /v1/maps/upload_image
      def upload_image
        return render json: { error: 'No file provided' }, status: :unprocessable_entity if params[:file].blank?

        file = params[:file]

        begin
          # Upload to S3
          s3_key = "images/#{SecureRandom.uuid}_#{file.original_filename}"
          s3_client = Aws::S3::Client.new(
            region: ENV['AWS_REGION'] || 'us-east-1',
            access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
            secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil)
          )

          # Upload without ACL (ACLs disabled on modern S3 buckets)
          s3_client.put_object(
            bucket: ENV.fetch('AWS_S3_BUCKET', nil),
            key: s3_key,
            body: file.read,
            content_type: file.content_type
          )

          # Generate standard S3 URL
          # Note: For permanent public access, you'll need to:
          # 1. Go to AWS S3 Console
          # 2. Select the bucket 'dorman-lakely-maps'
          # 3. Permissions → Block Public Access → Edit → Uncheck "Block all public access" for images
          # 4. Add a bucket policy to allow public read for images/* path
          url = "https://#{ENV.fetch('AWS_S3_BUCKET', nil)}.s3.#{ENV.fetch('AWS_REGION', nil)}.amazonaws.com/#{s3_key}"

          render json: { url: url }, status: :created
        rescue StandardError => e
          Rails.logger.error "Image upload failed: #{e.message}"
          Rails.logger.error e.backtrace.join("\n")
          render json: { error: "Failed to upload image: #{e.message}" }, status: :unprocessable_entity
        end
      end

      # DELETE /v1/maps/:id/files/:file_id
      def delete_file
        map = FoundryMap.find(params[:id])
        file = map.foundry_map_files.find(params[:file_id])

        if file.destroy
          head :no_content
        else
          render json: { error: 'Failed to delete file' }, status: :unprocessable_entity
        end
      end

      private

      def determine_file_type(filename)
        extension = File.extname(filename).downcase
        basename = File.basename(filename, extension).downcase

        # Determine type by filename patterns and extensions
        if filename.include?('scene') && extension == '.json'
          'scene'
        elsif filename.include?('thumbnail') || filename.include?('preview')
          'thumbnail'
        elsif basename.include?('background') || basename.include?('map')
          'background'
        elsif basename.include?('tile')
          'tile'
        elsif basename.include?('token')
          'token'
        elsif extension.in?(['.mp3', '.ogg', '.wav', '.m4a', '.flac', '.webm', '.mp4'])
          'audio'
        elsif extension.in?(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'])
          'background' # Default images to background
        elsif extension == '.json'
          'scene'
        else
          'other'
        end
      end

      def map_params
        params.require(:foundry_map).permit(
          :name,
          :description,
          :thumbnail_url,
          :thumbnail_s3_key,
          :access_level,
          :required_tier,
          :grid_size,
          :grid_units,
          :width,
          :height,
          :published,
          keywords: []
        )
      end

      def update_tags(map, tag_names)
        tag_names = tag_names.split(',').map(&:strip) if tag_names.is_a?(String)
        tags = tag_names.map do |tag_name|
          FoundryMapTag.find_or_create_by(name: tag_name)
        end
        map.foundry_map_tags = tags
      end

      def process_scene_package(map, zip_file)
        require 'zip'
        require 'parallel'

        # Create temp directory
        temp_dir = Rails.root.join('tmp', 'map_uploads', SecureRandom.uuid)
        FileUtils.mkdir_p(temp_dir)

        begin
          # Extract ZIP
          Zip::File.open(zip_file.tempfile.path) do |zip|
            zip.each do |entry|
              extract_path = temp_dir.join(entry.name)
              FileUtils.mkdir_p(extract_path.dirname)
              entry.extract(extract_path) unless File.exist?(extract_path)
            end
          end

          # Find scene.json
          scene_json_path = temp_dir.join('scene.json')
          raise 'Package must contain scene.json at root level' unless scene_json_path.exist?

          # Parse scene data
          scene_data = JSON.parse(File.read(scene_json_path))

          # Extract dimensions from scene if not already set
          if map.width.blank? || map.height.blank?
            map.update!(
              width: scene_data['width'],
              height: scene_data['height']
            )
          end

          # Update paths in scene JSON
          map_slug = map.name.parameterize
          scene_data = update_scene_paths(scene_data, map_slug)

          # Re-save scene.json with updated paths
          File.write(scene_json_path, JSON.pretty_generate(scene_data))

          # Collect all files to upload
          files_to_upload = Dir.glob(temp_dir.join('**/*')).reject { |f| File.directory?(f) }

          Rails.logger.info "Processing #{files_to_upload.length} files for map #{map.id}"

          # Create a shared S3 client (thread-safe per AWS SDK documentation)
          s3_client = Aws::S3::Client.new(
            region: ENV['AWS_REGION'] || 'us-east-1',
            access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
            secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil)
          )

          # Upload files in parallel (max 10 concurrent uploads)
          # Each result is either {:success => data} or {:error => message}
          upload_results = Parallel.map(files_to_upload, in_threads: 10) do |file_path|
            relative_path = Pathname.new(file_path).relative_path_from(temp_dir).to_s
            file_data = upload_map_file_parallel(map, file_path, relative_path, map_slug, s3_client)
            { success: file_data }
          rescue StandardError => e
            { error: "#{relative_path}: #{e.message}" }
          end

          # Separate successes and failures
          failures = upload_results.select { |r| r[:error] }
          uploaded_files = upload_results.select { |r| r[:success] }.pluck(:success)

          # Raise if any uploads failed
          if failures.any?
            error_details = failures.pluck(:error).join('; ')
            raise "Failed to upload #{failures.length} file(s): #{error_details}"
          end

          # Create database records in a transaction (must be done in main thread for ActiveRecord)
          ActiveRecord::Base.transaction do
            uploaded_files.each do |file_data|
              map.foundry_map_files.create!(file_data)
            end
          end

          Rails.logger.info "Successfully processed package for map #{map.id}: #{map.name}"
        ensure
          # Cleanup temp directory
          FileUtils.rm_rf(temp_dir) if temp_dir&.exist?
        end
      end

      def update_scene_paths(scene_data, map_slug)
        base_path = "modules/dorman-lakely-cartography/assets/scenes/#{map_slug}"

        # Recursively update all asset paths
        def update_paths_recursive(obj, base_path)
          case obj
          when Hash
            obj.each do |key, value|
              if %w[src path sound img icon].include?(key) && value.is_a?(String)
                # Extract filename from original path
                filename = File.basename(value)

                # Determine subfolder based on context or path
                folder = if value.include?('/tiles/')
                           'tiles'
                         elsif value.include?('/tokens/')
                           'tokens'
                         elsif value.match?(/\.(mp3|ogg|wav|webm)$/i)
                           'audio'
                         else
                           ''
                         end

                # Build new path
                obj[key] = if folder.empty?
                             "#{base_path}/#{filename}"
                           else
                             "#{base_path}/#{folder}/#{filename}"
                           end
              elsif value.is_a?(Hash) || value.is_a?(Array)
                update_paths_recursive(value, base_path)
              end
            end
          when Array
            obj.each { |item| update_paths_recursive(item, base_path) if item.is_a?(Hash) || item.is_a?(Array) }
          end
          obj
        end

        update_paths_recursive(scene_data, base_path)
      end

      def upload_map_file(map, file_path, relative_path, map_slug)
        # Generate S3 key
        s3_key = "maps/#{map.id}/#{SecureRandom.uuid}_#{File.basename(relative_path)}"

        # Get S3 client
        s3_client = Aws::S3::Client.new(
          region: ENV['AWS_REGION'] || 'us-east-1',
          access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
          secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil)
        )

        # Upload to S3
        File.open(file_path, 'rb') do |file|
          s3_client.put_object(
            bucket: ENV.fetch('AWS_S3_BUCKET', nil),
            key: s3_key,
            body: file,
            content_type: Marcel::MimeType.for(file_path)
          )
        end

        # Build Foundry path
        foundry_path = if relative_path == 'scene.json'
                         "modules/dorman-lakely-cartography/assets/scenes/#{map_slug}/scene.json"
                       else
                         "modules/dorman-lakely-cartography/assets/scenes/#{map_slug}/#{relative_path}"
                       end

        # Create database record
        map.foundry_map_files.create!(
          file_path: foundry_path,
          file_type: determine_file_type(File.basename(relative_path)),
          file_size: File.size(file_path),
          s3_key: s3_key
        )
      end

      # Thread-safe version for parallel uploads - returns data hash instead of creating record
      def upload_map_file_parallel(map, file_path, relative_path, map_slug, s3_client)
        # Generate S3 key
        s3_key = "maps/#{map.id}/#{SecureRandom.uuid}_#{File.basename(relative_path)}"

        # Upload to S3 (s3_client is thread-safe)
        File.open(file_path, 'rb') do |file|
          s3_client.put_object(
            bucket: ENV.fetch('AWS_S3_BUCKET', nil),
            key: s3_key,
            body: file,
            content_type: Marcel::MimeType.for(file_path)
          )
        end

        # Build Foundry path
        foundry_path = if relative_path == 'scene.json'
                         "modules/dorman-lakely-cartography/assets/scenes/#{map_slug}/scene.json"
                       else
                         "modules/dorman-lakely-cartography/assets/scenes/#{map_slug}/#{relative_path}"
                       end

        # Return data hash for database record creation in main thread
        {
          file_path: foundry_path,
          file_type: determine_file_type(File.basename(relative_path)),
          file_size: File.size(file_path),
          s3_key: s3_key
        }
      end
    end
  end
end
