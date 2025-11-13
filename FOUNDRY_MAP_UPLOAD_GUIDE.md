# Foundry Map Upload Guide

Complete guide for content creators to prepare and upload maps for distribution through the Dorman Lakely Cartography module.

## Table of Contents

1. [Preparing Your Map in Foundry](#preparing-your-map-in-foundry)
2. [Exporting the Scene](#exporting-the-scene)
3. [Organizing Your Files](#organizing-your-files)
4. [Uploading to the System](#uploading-to-the-system)
5. [Testing the Download](#testing-the-download)

---

## Preparing Your Map in Foundry

### 1. Create Your Scene in Foundry VTT

Open Foundry and create your scene with:
- Background image imported
- Walls drawn
- Lights configured
- Ambient sounds added
- Tiles placed (if any)
- Tokens positioned (if any)
- Grid settings configured

**Important Settings to Configure:**
```
Scene Settings:
- Grid Type: Square
- Grid Size: 140 pixels (or your preference)
- Grid Distance: 5 ft (or your preference)
- Grid Units: ft
- Background Image: Your map image
- Dimensions: Width x Height in pixels
```

### 2. Test the Scene

Before exporting:
- [ ] Verify walls block line of sight
- [ ] Test lighting
- [ ] Check ambient sounds play correctly
- [ ] Ensure all assets load properly
- [ ] Test with players if possible

---

## Exporting the Scene

### Method 1: Using the Scene Exporter Module (Recommended)

1. **Install Scene Exporter Module**
   - In Foundry, go to Add-on Modules
   - Search for "Scene Exporter" or similar
   - Install and enable it

2. **Export Your Scene**
   - Right-click your scene in the Scenes sidebar
   - Select "Export Scene" (or similar option)
   - This creates a JSON file with all scene data

### Method 2: Manual Export via Console

1. **Open Browser Console** (F12)

2. **Run this command** (replace "Scene Name" with your scene's name):
```javascript
// Get the scene
const scene = game.scenes.getName("Your Scene Name");

// Export scene data
const sceneData = scene.toJSON();

// Download as JSON
const dataStr = JSON.stringify(sceneData, null, 2);
const dataBlob = new Blob([dataStr], {type: 'application/json'});
const url = URL.createObjectURL(dataBlob);
const link = document.createElement('a');
link.href = url;
link.download = 'scene-export.json';
link.click();
```

### Method 3: From Foundry's Data Folder

Scene data is stored in:
```
[Foundry Data]/worlds/[your-world]/data/scenes.db
```

You can use a LevelDB reader to extract the scene JSON, but Methods 1 or 2 are easier.

---

## Organizing Your Files

### Step 1: Gather All Assets

Create a folder structure like this:

```
dungeon-depths/
├── scene.json              # Exported scene data
├── background.webp         # Main map image
├── tiles/                  # Tile images (if any)
│   ├── torch-1.webp
│   └── door-closed.png
├── tokens/                 # Custom tokens (if any)
│   ├── goblin.png
│   └── boss.png
├── audio/                  # Sound files (if any)
│   ├── ambient-cave.mp3
│   └── water-drip.ogg
└── thumbnail.jpg           # Preview for gallery
```

### Step 2: Prepare the Scene JSON

Edit the exported `scene.json` to update file paths:

**Original paths (in your Foundry):**
```json
{
  "background": {
    "src": "worlds/my-world/maps/dungeon.webp"
  },
  "tiles": [
    {
      "texture": {
        "src": "worlds/my-world/tiles/torch.webp"
      }
    }
  ]
}
```

**Updated paths (for distribution):**
```json
{
  "background": {
    "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp"
  },
  "tiles": [
    {
      "texture": {
        "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/tiles/torch.webp"
      }
    }
  ]
}
```

**Path Pattern:**
```
modules/dorman-lakely-cartography/assets/scenes/[map-slug]/[filename]
```

### Step 3: Create a Thumbnail

- Size: 400x300px recommended
- Format: JPG or WebP
- Shows the map overview
- Will display in the gallery

---

## Uploading to the System

### Option A: Using the Admin UI (Easiest)

1. **Start your Rails server**
   ```bash
   cd ~/Code/dungeon-master-guru
   bin/dev
   ```

2. **Open the admin interface**
   ```
   http://localhost:3000/v1/maps-admin
   ```

3. **Create New Map**
   - Click "New Map"
   - Fill in details:
     - Name: "Dungeon Depths"
     - Description: "A dark dungeon with multiple levels"
     - Access Level: Free or Premium
     - Grid Size: 5
     - Grid Units: ft
     - Width: 4000 (pixels)
     - Height: 3000 (pixels)
     - Tags: dungeon, combat, underground

4. **Upload Thumbnail**
   - Click "Upload Thumbnail"
   - Select your thumbnail.jpg
   - This uploads to S3 and sets the thumbnail_url

5. **Upload Map Files**
   - Click "Upload Files"
   - Select ALL files:
     - scene.json
     - background.webp
     - All tiles/*.webp
     - All tokens/*.png
     - All audio/*.mp3
   - Click Upload
   - Files are uploaded to S3 and database records are created

6. **Set Tags**
   - Enter tags: "Dungeon, Combat, Underground"
   - These will be searchable in the gallery

7. **Preview & Publish**
   - Review all details
   - Check thumbnail displays
   - Click "Publish" to make available

### Option B: Using the API (Advanced)

1. **Upload Thumbnail to S3**
   ```bash
   curl -X POST http://localhost:3000/v1/maps/upload_image \
     -F "file=@thumbnail.jpg" \
     -H "Content-Type: multipart/form-data"
   ```

   Response:
   ```json
   {
     "url": "https://your-bucket.s3.amazonaws.com/images/abc123_thumbnail.jpg"
   }
   ```

2. **Create the Map**
   ```bash
   curl -X POST http://localhost:3000/v1/maps \
     -H "Content-Type: application/json" \
     -d '{
       "foundry_map": {
         "name": "Dungeon Depths",
         "description": "A dark dungeon with multiple levels",
         "thumbnail_url": "https://...",
         "access_level": "premium",
         "grid_size": 5,
         "grid_units": "ft",
         "width": 4000,
         "height": 3000,
         "published": true,
         "keywords": ["dungeon", "cave"]
       },
       "tags": ["Dungeon", "Combat", "Underground"]
     }'
   ```

   Response:
   ```json
   {
     "id": "1",
     "name": "Dungeon Depths",
     ...
   }
   ```

3. **Upload Map Files**
   ```bash
   curl -X POST http://localhost:3000/v1/maps/1/upload_files \
     -F "files[]=@scene.json" \
     -F "files[]=@background.webp" \
     -F "files[]=@tiles/torch-1.webp" \
     -F "files[]=@audio/ambient.mp3"
   ```

### Option C: Using Rails Console (Development)

```ruby
# Start Rails console
rails console

# Create the map
map = FoundryMap.create!(
  name: "Dungeon Depths",
  description: "A dark dungeon with multiple levels",
  thumbnail_url: "https://your-s3-url/thumbnail.jpg",
  access_level: "premium",
  grid_size: 5,
  grid_units: "ft",
  width: 4000,
  height: 3000,
  published: true,
  keywords: ["dungeon", "cave"]
)

# Add tags
dungeon_tag = FoundryMapTag.find_or_create_by!(name: "Dungeon")
combat_tag = FoundryMapTag.find_or_create_by!(name: "Combat")
map.foundry_map_tags << [dungeon_tag, combat_tag]

# Upload files to S3 (pseudo-code)
s3_client = Aws::S3::Client.new(
  region: ENV['AWS_REGION'],
  access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
)

# Upload scene.json
File.open('dungeon-depths/scene.json', 'rb') do |file|
  s3_key = "maps/#{map.id}/#{SecureRandom.uuid}_scene.json"

  s3_client.put_object(
    bucket: ENV['AWS_S3_BUCKET'],
    key: s3_key,
    body: file,
    content_type: 'application/json'
  )

  map.foundry_map_files.create!(
    file_path: "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/scene.json",
    file_type: "scene",
    file_size: file.size,
    s3_key: s3_key
  )
end

# Repeat for each file...
```

---

## File Path Mapping

When users download, files are placed in:
```
[Foundry Data]/modules/dorman-lakely-cartography/assets/scenes/[map-slug]/
```

Your scene JSON must reference files with these exact paths.

### Path Examples

**Scene file path in database:**
```
modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/scene.json
```

**Background path in scene JSON:**
```json
{
  "background": {
    "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp"
  }
}
```

**Tile path in scene JSON:**
```json
{
  "tiles": [
    {
      "texture": {
        "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/tiles/torch-1.webp"
      }
    }
  ]
}
```

---

## Testing the Download

### 1. In Foundry VTT

1. **Open Foundry** with a test world
2. **Enable the module** in Module Settings
3. **Open Scenes Directory** (map icon in left sidebar)
4. **Click "Dorman Lakely Cartography"** button
5. **Find your map** in the gallery
6. **Click to view details**
7. **Click "Download Map"**

### 2. Verify Files Downloaded

Check that files exist in:
```
[Foundry Data]/modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/
```

You should see:
- scene.json
- background.webp
- tiles/ (if applicable)
- tokens/ (if applicable)
- audio/ (if applicable)

### 3. Import the Scene

The module should automatically import the scene, but you can also:

1. **Go to Scenes tab**
2. **Right-click** → Import Data
3. **Paste the scene JSON** or select the file
4. **Click Import**

### 4. Test the Scene

- [ ] Background loads
- [ ] Tiles appear correctly
- [ ] Walls work
- [ ] Lights work
- [ ] Audio plays
- [ ] Grid is correct
- [ ] Tokens load (if included)

---

## Common Issues & Solutions

### Issue: Paths Don't Match

**Problem:** Scene references `worlds/my-world/map.webp` but file is at `modules/...`

**Solution:** Edit scene.json before uploading:
```bash
# Find and replace paths
sed -i 's|worlds/my-world/|modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/|g' scene.json
```

### Issue: Files Too Large

**Problem:** Background image is 50MB+

**Solution:** Optimize images before uploading:
```bash
# Using ImageMagick
convert background.jpg -quality 85 -resize 4000x3000 background.webp

# Using FFmpeg for audio
ffmpeg -i ambient.wav -codec:a libmp3lame -b:a 128k ambient.mp3
```

### Issue: Scene Won't Import

**Problem:** JSON is invalid or corrupt

**Solution:** Validate JSON:
```bash
# Check if valid JSON
cat scene.json | jq . > /dev/null

# Pretty print to find errors
jq . scene.json > scene-formatted.json
```

### Issue: Access Permissions

**Problem:** Files return 403 Forbidden

**Solution:** Check S3 bucket permissions and signed URL generation

---

## Optimization Tips

### Images
- Use WebP format (50-75% smaller than PNG)
- Max resolution: 4096x4096
- Quality: 80-85%

### Audio
- Use OGG or MP3
- Bitrate: 96-128kbps for ambient
- Trim silence from start/end

### File Sizes
- Scene JSON: < 100KB
- Background: 1-5MB
- Tiles: 100-500KB each
- Audio: 500KB-2MB per file

### Scene Optimization
- Remove unused placeables
- Clean up hidden objects
- Minimize wall segments
- Use audio sparingly

---

## Batch Upload Script

For uploading multiple maps, create a script:

```bash
#!/bin/bash
# upload-map.sh

MAP_DIR=$1
MAP_NAME=$2
ACCESS_LEVEL=${3:-premium}

# Upload thumbnail
THUMB_URL=$(curl -s -X POST http://localhost:3000/v1/maps/upload_image \
  -F "file=@${MAP_DIR}/thumbnail.jpg" | jq -r .url)

# Create map
MAP_ID=$(curl -s -X POST http://localhost:3000/v1/maps \
  -H "Content-Type: application/json" \
  -d "{
    \"foundry_map\": {
      \"name\": \"${MAP_NAME}\",
      \"thumbnail_url\": \"${THUMB_URL}\",
      \"access_level\": \"${ACCESS_LEVEL}\",
      \"published\": true
    }
  }" | jq -r .id)

# Upload all files
find "${MAP_DIR}" -type f ! -name "thumbnail.jpg" -exec \
  curl -X POST http://localhost:3000/v1/maps/${MAP_ID}/upload_files \
  -F "files[]=@{}" \;

echo "Map uploaded with ID: ${MAP_ID}"
```

Usage:
```bash
./upload-map.sh ./dungeon-depths "Dungeon Depths" premium
```

---

## Checklist

Before publishing a map:

### Content
- [ ] Scene is complete and tested
- [ ] All assets are included
- [ ] Scene JSON is edited with correct paths
- [ ] Thumbnail is created
- [ ] Description is written
- [ ] Tags are selected

### Technical
- [ ] Files are optimized
- [ ] Paths are updated in JSON
- [ ] Grid settings are correct
- [ ] No absolute paths in JSON
- [ ] All files are uploaded to S3

### Quality
- [ ] Scene loads without errors
- [ ] All images display
- [ ] Walls work correctly
- [ ] Lights work correctly
- [ ] Audio plays (if included)
- [ ] Performance is acceptable

### Publishing
- [ ] Access level is set (Free/Premium)
- [ ] Published flag is true
- [ ] Tags are added
- [ ] Thumbnail displays in gallery
- [ ] Download works
- [ ] Scene imports correctly

---

## Support

If you encounter issues:

1. Check the Rails logs: `tail -f log/development.log`
2. Check S3 upload status
3. Verify database records
4. Test download in Foundry
5. Check browser console for errors

For bugs or questions, open an issue on GitHub.
