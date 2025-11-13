# Map Packaging & Upload Guide
**Simple workflow for Dorman Lakely Cartography**

## Overview

The ideal workflow:

1. **In Foundry**: Create scene → Export as package → Get one ZIP file
2. **In Rails Admin**: Upload ZIP → Add metadata → Publish
3. **In Module**: Users browse gallery → Click download → Everything works

---

## Step 1: Create Package in Foundry

### Method 1: Right-Click Export (Easiest!)

**NEW! The module now includes a built-in export feature:**

1. **Open Foundry VTT** with the Dorman Lakely Cartography module enabled
2. **Go to Scenes Directory** (the map icon in the left sidebar)
3. **Right-click the scene** you want to export
4. **Select "Export for Dorman Lakely Cartography"** from the context menu
5. **Wait for export** (you'll see progress notifications)
6. **ZIP file downloads automatically** to your browser's download folder

**That's it!** No console commands needed.

---

### Method 2: Console Script (Advanced)

If you prefer using the console or the right-click option isn't available:

```javascript
// Run this in Foundry console to export scene with all assets
async function exportScenePackage(sceneName) {
  const scene = game.scenes.getName(sceneName);
  if (!scene) {
    ui.notifications.error(`Scene "${sceneName}" not found`);
    return;
  }

  // Create JSZip instance
  const zip = new JSZip();

  // Add scene JSON
  const sceneData = scene.toJSON();
  zip.file('scene.json', JSON.stringify(sceneData, null, 2));

  // Collect all asset URLs from scene
  const assets = new Set();

  // Background
  if (scene.background?.src) assets.add(scene.background.src);

  // Tiles
  scene.tiles.forEach(tile => {
    if (tile.texture?.src) assets.add(tile.texture.src);
  });

  // Tokens
  scene.tokens.forEach(token => {
    if (token.texture?.src) assets.add(token.texture.src);
  });

  // Sounds
  scene.sounds.forEach(sound => {
    if (sound.path) assets.add(sound.path);
  });

  // Download each asset and add to ZIP
  let count = 0;
  for (const assetPath of assets) {
    try {
      // Fetch the file
      const response = await fetch(assetPath);
      if (!response.ok) continue;

      const blob = await response.blob();
      const filename = assetPath.split('/').pop();

      // Determine folder
      let folder = '';
      if (assetPath.includes('/tiles/')) folder = 'tiles/';
      else if (assetPath.includes('/tokens/')) folder = 'tokens/';
      else if (assetPath.match(/\.(mp3|ogg|wav|webm)$/i)) folder = 'audio/';

      zip.file(folder + filename, blob);
      count++;
      ui.notifications.info(`Packed ${count}/${assets.size} assets...`);
    } catch (err) {
      console.error(`Failed to pack ${assetPath}:`, err);
    }
  }

  // Generate ZIP
  ui.notifications.info('Generating ZIP file...');
  const zipBlob = await zip.generateAsync({type: 'blob'});

  // Download
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${scene.name.slugify()}-package.zip`;
  link.click();

  ui.notifications.info('Scene package exported!');
}

// Usage:
exportScenePackage("Dungeon Depths");
```

### What Gets Packaged

The ZIP contains:
```
dungeon-depths-package.zip
├── scene.json          # Scene configuration
├── background.webp     # Main map image
├── tiles/              # All tile images
│   ├── torch-1.webp
│   └── door.png
├── tokens/             # All token images
│   └── goblin.png
└── audio/              # All sounds
    └── ambient.mp3
```

---

## Step 2: Upload to Rails Admin

### Admin UI Upload Form

```ruby
# app/views/admin/v1/foundry_maps_admin/new.html.erb

<h1>Upload New Map</h1>

<form method="post" enctype="multipart/form-data">
  <!-- Basic Info -->
  <div class="form-group">
    <label>Map Name *</label>
    <input type="text" name="map[name]" required>
  </div>

  <div class="form-group">
    <label>Description</label>
    <textarea name="map[description]" rows="4"></textarea>
  </div>

  <!-- Package Upload -->
  <div class="form-group">
    <label>Scene Package (ZIP) *</label>
    <input type="file" name="package" accept=".zip" required>
    <small>Upload the ZIP file exported from Foundry</small>
  </div>

  <!-- Thumbnail -->
  <div class="form-group">
    <label>Thumbnail *</label>
    <input type="file" name="thumbnail" accept="image/*" required>
    <small>400x300px preview image for gallery</small>
  </div>

  <!-- Metadata -->
  <div class="form-group">
    <label>Access Level</label>
    <select name="map[access_level]">
      <option value="free">Free</option>
      <option value="premium">Premium</option>
    </select>
  </div>

  <div class="form-group">
    <label>Tags (comma-separated)</label>
    <input type="text" name="tags" placeholder="Dungeon, Combat, Underground">
  </div>

  <div class="form-group">
    <label>Grid Size</label>
    <input type="number" name="map[grid_size]" value="5">
  </div>

  <div class="form-group">
    <label>Grid Units</label>
    <input type="text" name="map[grid_units]" value="ft">
  </div>

  <!-- Publish -->
  <div class="form-group">
    <label>
      <input type="checkbox" name="map[published]" value="1">
      Publish immediately
    </label>
  </div>

  <button type="submit">Upload Map Package</button>
</form>
```

### Processing the Upload

```ruby
# app/controllers/admin/v1/foundry_maps_admin_controller.rb

def create
  # 1. Upload thumbnail
  thumbnail_url = upload_to_s3(params[:thumbnail], 'thumbnails')

  # 2. Create map record
  map = FoundryMap.create!(
    name: params[:map][:name],
    description: params[:map][:description],
    thumbnail_url: thumbnail_url,
    access_level: params[:map][:access_level] || 'premium',
    grid_size: params[:map][:grid_size],
    grid_units: params[:map][:grid_units],
    published: params[:map][:published] == '1'
  )

  # 3. Process ZIP package
  process_scene_package(map, params[:package])

  # 4. Add tags
  if params[:tags].present?
    tag_names = params[:tags].split(',').map(&:strip)
    tags = tag_names.map { |name| FoundryMapTag.find_or_create_by!(name: name) }
    map.foundry_map_tags = tags
  end

  redirect_to admin_v1_foundry_maps_path, notice: 'Map uploaded successfully!'
rescue => e
  flash[:error] = "Upload failed: #{e.message}"
  render :new
end

private

def process_scene_package(map, zip_file)
  require 'zip'

  # Create temp directory
  temp_dir = Rails.root.join('tmp', 'map_uploads', SecureRandom.uuid)
  FileUtils.mkdir_p(temp_dir)

  # Extract ZIP
  Zip::File.open(zip_file.tempfile.path) do |zip|
    zip.each do |entry|
      extract_path = temp_dir.join(entry.name)
      FileUtils.mkdir_p(extract_path.dirname)
      entry.extract(extract_path)
    end
  end

  # Find scene.json
  scene_json_path = temp_dir.join('scene.json')
  unless scene_json_path.exist?
    raise "Package must contain scene.json"
  end

  # Parse scene data
  scene_data = JSON.parse(File.read(scene_json_path))

  # Extract dimensions
  map.update!(
    width: scene_data['width'],
    height: scene_data['height']
  )

  # Update paths in scene JSON
  map_slug = map.name.parameterize
  scene_data = update_scene_paths(scene_data, map_slug)

  # Re-save scene.json with updated paths
  File.write(scene_json_path, JSON.pretty_generate(scene_data))

  # Upload all files to S3
  Dir.glob(temp_dir.join('**/*')).each do |file_path|
    next if File.directory?(file_path)

    relative_path = Pathname.new(file_path).relative_path_from(temp_dir).to_s
    upload_map_file(map, file_path, relative_path, map_slug)
  end

  # Store scene data in compendium
  add_to_compendium(map, scene_data)

ensure
  # Cleanup
  FileUtils.rm_rf(temp_dir) if temp_dir && temp_dir.exist?
end

def update_scene_paths(scene_data, map_slug)
  # Recursively update all asset paths
  base_path = "modules/dorman-lakely-cartography/assets/scenes/#{map_slug}"

  def update_paths_recursive(obj, base_path)
    case obj
    when Hash
      obj.each do |key, value|
        if ['src', 'path'].include?(key) && value.is_a?(String)
          # Extract filename and determine subfolder
          filename = File.basename(value)
          folder = case
          when value.include?('/tiles/') then 'tiles'
          when value.include?('/tokens/') then 'tokens'
          when value.match?(/\.(mp3|ogg|wav)$/i) then 'audio'
          else ''
          end

          obj[key] = [base_path, folder, filename].reject(&:blank?).join('/')
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
  # Determine file type
  file_type = determine_file_type(relative_path)

  # Generate S3 key
  s3_key = "maps/#{map.id}/#{SecureRandom.uuid}_#{File.basename(relative_path)}"

  # Upload to S3
  File.open(file_path, 'rb') do |file|
    s3_client.put_object(
      bucket: ENV['AWS_S3_BUCKET'],
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
    file_type: file_type,
    file_size: File.size(file_path),
    s3_key: s3_key
  )
end

def add_to_compendium(map, scene_data)
  # Add metadata flags
  scene_data['flags'] ||= {}
  scene_data['flags']['dorman-lakely-cartography'] = {
    mapId: map.id.to_s,
    slug: map.name.parameterize,
    requiresDownload: true,
    version: '1.0'
  }

  # Save to compendium source
  source_path = Rails.root.join('modules', 'dorman-lakely-cartography', 'packs', '_source', 'maps')
  FileUtils.mkdir_p(source_path)

  File.write(
    source_path.join("#{map.id}.json"),
    JSON.pretty_generate(scene_data)
  )

  # Note: Run `npm run build:db` to rebuild compendium
end

def s3_client
  @s3_client ||= Aws::S3::Client.new(
    region: ENV['AWS_REGION'] || 'us-east-1',
    access_key_id: ENV['AWS_ACCESS_KEY_ID'],
    secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
  )
end
```

---

## Step 3: Display in Module Gallery

The module already has the gallery UI. It will show:

- ✅ Thumbnail from S3
- ✅ Map name and description
- ✅ Tags for filtering
- ✅ Access level (Free/Premium badge)
- ✅ Grid info (5ft, 140px, etc.)
- ✅ Resolution (4000x3000)
- ✅ Download button

---

## Step 4: Download & Extract

When user clicks "Download":

```typescript
// In the Foundry module

async downloadMap(mapId: string): Promise<void> {
  // 1. Fetch file manifest
  const manifest = await this.apiService.fetchFileManifest(mapId);

  // 2. Check what files are missing
  const missingFiles = [];
  for (const file of manifest.files) {
    const exists = await this.fileExists(file.path);
    if (!exists) {
      missingFiles.push(file);
    }
  }

  if (missingFiles.length === 0) {
    ui.notifications.info('All files already downloaded!');
    await this.importScene(mapId);
    return;
  }

  // 3. Show download dialog
  new DownloadDialog(map, missingFiles).render(true);

  // 4. Download files concurrently
  const downloader = new ConcurrentDownloadManager(5);

  for (const file of missingFiles) {
    await downloader.download(mapId, file.path, (progress) => {
      // Update progress bar
      this.updateProgress(progress);
    });
  }

  // 5. Import scene from compendium
  ui.notifications.success('Download complete! Importing scene...');
  await this.importScene(mapId);
}

async importScene(mapId: string): Promise<void> {
  // Find scene in compendium by mapId flag
  const pack = game.packs.get('dorman-lakely-cartography.maps');
  const scenes = await pack.getDocuments();

  const scene = scenes.find(s =>
    s.flags?.['dorman-lakely-cartography']?.mapId === mapId
  );

  if (!scene) {
    throw new Error('Scene not found in compendium');
  }

  // Import into world
  const imported = await scene.clone({}, {save: true});

  // Activate scenes sidebar
  ui.sidebar.activateTab('scenes');

  ui.notifications.info(`${imported.name} imported successfully!`);
}
```

### File Structure After Download

```
[Foundry Data]/modules/dorman-lakely-cartography/assets/scenes/
└── dungeon-depths/
    ├── scene.json           # Not needed (scene in compendium)
    ├── background.webp      # ✓ Downloaded
    ├── tiles/
    │   ├── torch-1.webp     # ✓ Downloaded
    │   └── door.png         # ✓ Downloaded
    ├── tokens/
    │   └── goblin.png       # ✓ Downloaded
    └── audio/
        └── ambient.mp3      # ✓ Downloaded
```

**Scene imports from compendium and references these files!**

---

## Complete Workflow Summary

### Content Creator (You)

1. **Create scene in Foundry** with all assets
2. **Run export script** in console → Get `dungeon-depths-package.zip`
3. **Create thumbnail** (400x300px)
4. **Open Rails admin** at `http://localhost:3000/v1/maps-admin`
5. **Click "Upload New Map"**
6. **Fill form**:
   - Name: Dungeon Depths
   - Description: A dark dungeon...
   - Upload ZIP
   - Upload thumbnail
   - Set access level
   - Add tags
7. **Click Submit** → Rails processes everything
8. **Run `npm run build:db`** to rebuild compendium
9. **Done!** Map is live

### End User (Your Patrons)

1. **Open Foundry VTT**
2. **Click Scenes tab** → "Dorman Lakely Cartography" button
3. **Browse gallery** with beautiful thumbnails
4. **Filter by tags** (Dungeon, Combat, etc.)
5. **Click map** to see details
6. **Click "Download Map"**
7. **Progress bar** shows download (15 files...)
8. **"Download complete!"** notification
9. **Scene imports** automatically
10. **Ready to play!**

---

## Benefits of This Approach

✅ **Simple for You**: Export → Upload ZIP → Done
✅ **Beautiful Gallery**: Rich browsing experience
✅ **Smart Downloads**: Only downloads missing files
✅ **Fast**: Concurrent downloads (5 at a time)
✅ **Reliable**: Files cached, can re-download
✅ **Access Control**: Patreon integration
✅ **Professional**: Matches FA Battlemaps workflow

---

## Next Steps

1. **Add ZIP processing** to Rails controller
2. **Create export script** for Foundry console
3. **Build admin UI** for uploads
4. **Test with sample map**
5. **Deploy!**

Would you like me to implement the ZIP processing code next?
