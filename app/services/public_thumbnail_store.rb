# frozen_string_literal: true

# Images in the S3 bucket's thumbnails/ path, which the bucket policy lets
# anyone read, so pages can show them with a plain URL that never expires.
module PublicThumbnailStore
  PREFIX = 'thumbnails/'

  module_function

  # Uploads the image under thumbnails/<path> and returns its public URL
  def put(path, body, content_type)
    key = "#{PREFIX}#{path}"
    client.put_object(bucket: bucket, key: key, body: body, content_type: content_type)
    { key: key, url: "https://#{bucket}.s3.#{region}.amazonaws.com/#{key}" }
  end

  # Deletes an image put here. Logs and carries on if S3 fails, since a
  # leftover image is harmless.
  def delete(key)
    return if key.blank? || !key.start_with?(PREFIX)

    client.delete_object(bucket: bucket, key: key)
  rescue StandardError => e
    Rails.logger.error "Could not delete thumbnail #{key}: #{e.message}"
  end

  def client
    Aws::S3::Client.new(
      region: region,
      access_key_id: ENV.fetch('AWS_ACCESS_KEY_ID', nil),
      secret_access_key: ENV.fetch('AWS_SECRET_ACCESS_KEY', nil)
    )
  end

  def bucket
    ENV.fetch('AWS_S3_BUCKET', nil)
  end

  def region
    ENV['AWS_REGION'] || 'us-east-1'
  end
end
