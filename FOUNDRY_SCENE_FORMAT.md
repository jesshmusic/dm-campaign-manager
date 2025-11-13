# Foundry Scene Format for Dorman Lakely Cartography

Based on industry standards (FA Battlemaps) and Foundry VTT best practices.

## Overview

Maps are distributed using a **hybrid approach**:
1. **Scene data** stored in module compendium (preloaded)
2. **Assets** downloaded on-demand from Rails/S3
3. **Scene imported** from compendium with assets available

This matches the FA Battlemaps pattern and provides the best user experience.

---

## Architecture Comparison

### FA Battlemaps Approach (What We're Mimicking)
```
1. Scene definitions stored in levelDB compendium
2. User clicks "Download" in gallery
3. Assets downloaded to data folder
4. Scene imported from compendium
5. Paths automatically work
```

### Our Implementation
```
1. Scene definitions stored in compendium (packs/maps)
2. User clicks "Download" in gallery
3. Assets downloaded from Rails/S3
4. Scene imported from compendium
5. Paths point to downloaded assets
```

---

## File Organization

### In the Module (Shipped with Module)

```
dorman-lakely-cartography/
├── module.json
├── packs/
│   └── maps/               # LevelDB compendium
│       └── (scene data stored here)
├── dist/
│   └── main.js
├── styles/
│   └── main.css
└── templates/
    └── gallery.hbs
```

### Downloaded Assets (On User's System)

```
[Foundry Data]/modules/dorman-lakely-cartography/assets/scenes/
├── dungeon-depths/
│   ├── background.webp
│   ├── tiles/
│   │   ├── torch-1.webp
│   │   └── door.png
│   ├── tokens/
│   │   └── goblin.png
│   └── audio/
│       └── ambient-cave.mp3
├── forest-clearing/
│   └── ...
└── castle-throne-room/
    └── ...
```

---

## Scene Data Structure

### Scene JSON (Stored in Compendium)

```json
{
  "name": "Dungeon Depths",
  "folder": null,
  "thumb": null,
  "width": 4000,
  "height": 3000,
  "padding": 0.25,
  "initial": {
    "x": 2000,
    "y": 1500,
    "scale": 1
  },
  "background": {
    "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp",
    "offsetX": 0,
    "offsetY": 0,
    "scaleX": 1,
    "scaleY": 1
  },
  "grid": {
    "type": 1,
    "size": 140,
    "color": "#000000",
    "alpha": 0.2,
    "distance": 5,
    "units": "ft"
  },
  "walls": [
    {
      "c": [140, 140, 280, 140],
      "move": 20,
      "sense": 20,
      "door": 0,
      "ds": 0
    }
  ],
  "lights": [
    {
      "x": 700,
      "y": 700,
      "rotation": 0,
      "bright": 40,
      "dim": 80,
      "angle": 360,
      "tintColor": "#ff7700",
      "tintAlpha": 0.5
    }
  ],
  "sounds": [
    {
      "path": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/audio/ambient-cave.mp3",
      "x": 2000,
      "y": 1500,
      "radius": 100,
      "volume": 0.5,
      "repeat": true
    }
  ],
  "tiles": [
    {
      "texture": {
        "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/tiles/torch-1.webp"
      },
      "x": 560,
      "y": 560,
      "width": 140,
      "height": 140,
      "z": 100,
      "rotation": 0,
      "alpha": 1,
      "locked": false,
      "hidden": false
    }
  ],
  "tokens": [],
  "notes": [],
  "drawings": [],
  "templates": [],
  "flags": {
    "dorman-lakely-cartography": {
      "mapId": "1",
      "version": "1.0",
      "requiresDownload": true,
      "fileCount": 4,
      "totalSize": 5242880
    }
  }
}
```

---

## Asset Manifest Format

The Rails backend provides a manifest of all files needed:

```json
{
  "mapId": "1",
  "files": [
    {
      "path": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp",
      "size": 2450000,
      "type": "background"
    },
    {
      "path": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/tiles/torch-1.webp",
      "size": 125000,
      "type": "tile"
    },
    {
      "path": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/tiles/door-closed.png",
      "size": 85000,
      "type": "tile"
    },
    {
      "path": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/audio/ambient-cave.mp3",
      "size": 582880,
      "type": "audio"
    }
  ],
  "totalSize": 3242880
}
```

---

## Upload Process for Content Creators

### Step 1: Export Scene from Foundry

```javascript
// In Foundry console
const scene = game.scenes.getName("Your Scene Name");
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

### Step 2: Prepare Assets

Organize files:
```
dungeon-depths/
├── scene.json              # From export
├── background.webp         # Main map image
├── tiles/
│   ├── torch-1.webp
│   └── door-closed.png
├── tokens/                 # Optional
└── audio/                  # Optional
    └── ambient-cave.mp3
```

### Step 3: Update Paths in Scene JSON

Run the preparation script:
```bash
ruby scripts/prepare-scene.rb dungeon-depths/scene.json dungeon-depths
```

This updates all asset paths from:
```
worlds/my-world/maps/dungeon.webp
```

To:
```
modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp
```

### Step 4: Add to Module Compendium

```bash
# 1. Copy prepared scene to source
cp dungeon-depths/scene-prepared.json \
   packs/_source/maps/dungeon-depths.json

# 2. Rebuild compendium
npm run build:db

# 3. The scene is now in packs/maps/
```

### Step 5: Upload Assets to S3

```ruby
# In Rails console or via API
map = FoundryMap.create!(
  name: "Dungeon Depths",
  description: "A dark dungeon with multiple levels",
  thumbnail_url: "https://...",
  access_level: "premium",
  published: true
)

# Upload each file
Dir.glob("dungeon-depths/**/*").each do |file_path|
  next if File.directory?(file_path)

  # Upload to S3
  s3_key = "maps/#{map.id}/#{SecureRandom.uuid}_#{File.basename(file_path)}"
  # ... upload code ...

  # Create database record
  relative_path = file_path.sub('dungeon-depths/',
    'modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/')

  map.foundry_map_files.create!(
    file_path: relative_path,
    file_type: determine_type(file_path),
    file_size: File.size(file_path),
    s3_key: s3_key
  )
end
```

---

## Download Flow (User Experience)

### 1. User Opens Gallery
```
User: Clicks "Dorman Lakely Cartography" button
→ Gallery opens showing available maps
→ User sees "Dungeon Depths" with thumbnail
```

### 2. User Clicks Download
```
User: Clicks "Download Map"
→ Module checks if files exist locally
→ If not, opens download dialog
→ Shows file list and total size
```

### 3. Download Process
```
Module:
1. Fetches file manifest from Rails
   GET /v1/maps/files/1

2. Downloads each file concurrently (5 at a time)
   POST /v1/maps/file/1 {path: "..."}
   → Gets signed S3 URL
   → Downloads file
   → Saves to Foundry data folder

3. Shows progress: "Downloading 3/15 files (45%)"

4. When complete: "Download complete!"
```

### 4. Import Scene
```
Module:
1. Looks up scene in compendium by mapId flag
2. Imports scene from compendium
3. Scene references downloaded assets
4. Everything works!
```

---

## Path Resolution

### How Paths Work

1. **Scene Definition** (in compendium):
   ```json
   "background": {
     "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp"
   }
   ```

2. **Foundry Resolves To**:
   ```
   [Foundry Data]/modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp
   ```

3. **File Must Exist At That Location** after download

### Why This Works

- ✅ Paths are consistent across all installations
- ✅ No path remapping needed
- ✅ Scenes work immediately after download
- ✅ Users can re-download if files deleted
- ✅ Multiple worlds can share assets

---

## File Types and Extensions

| Type | Extensions | Usage |
|------|-----------|-------|
| `background` | `.webp`, `.jpg`, `.png` | Main map image |
| `tile` | `.webp`, `.png`, `.gif` | Tile overlays, lighting effects |
| `token` | `.webp`, `.png` | Custom token artwork |
| `audio` | `.mp3`, `.ogg`, `.webm` | Ambient sounds, music |
| `video` | `.webm`, `.mp4` | Animated tiles, backgrounds |
| `thumbnail` | `.jpg`, `.webp` | Gallery preview |

---

## Optimization Guidelines

### Images
- **Format**: WebP preferred (50-70% smaller than PNG)
- **Max Size**: 4096x4096px
- **Quality**: 80-85%
- **Background**: 1-5MB ideal
- **Tiles**: < 500KB each

### Audio
- **Format**: OGG preferred, MP3 acceptable
- **Bitrate**: 96-128kbps for ambient
- **Length**: Trim silence, loop seamlessly
- **Size**: 500KB-2MB per file

### Performance
- Limit to 20-30 tiles per scene
- Avoid 4K+ backgrounds if possible
- Use audio sparingly (2-3 tracks max)
- Compress video heavily

---

## Module Compendium Structure

### Building the Compendium

```bash
# 1. Add scenes to packs/_source/maps/
cp prepared-scenes/*.json packs/_source/maps/

# 2. Build the levelDB compendium
npm run build:db

# 3. Compendium is now in packs/maps/
# (Shipped with the module)
```

### Compendium Metadata

Each scene in the compendium includes:

```json
{
  "flags": {
    "dorman-lakely-cartography": {
      "mapId": "1",              // Rails database ID
      "slug": "dungeon-depths",   // URL-friendly name
      "requiresDownload": true,   // Assets need downloading
      "fileCount": 15,            // Number of files
      "totalSize": 5242880,       // Total bytes
      "version": "1.0"            // Map version
    }
  }
}
```

This metadata helps the module:
- Match scenes to database records
- Check if download is needed
- Show file count and size
- Handle updates

---

## Update Process

When you update a map:

1. **Update scene in compendium** with new data
2. **Upload new assets** to S3 with new keys
3. **Update version number** in scene flags
4. **Users see "Update Available"** in gallery
5. **Users download new assets**
6. **Old files can be purged** (optional)

---

## Checklist for New Maps

### Content Creation
- [ ] Scene created and tested in Foundry
- [ ] All walls, lights, sounds configured
- [ ] Tiles and tokens positioned
- [ ] Grid settings correct
- [ ] Scene exported to JSON

### Asset Preparation
- [ ] All images optimized (WebP, proper size)
- [ ] Audio compressed (OGG/MP3, < 2MB)
- [ ] Files organized in folders
- [ ] Paths updated in scene JSON
- [ ] Thumbnail created (400x300)

### Module Integration
- [ ] Scene added to packs/_source/maps/
- [ ] mapId flag added to scene
- [ ] Compendium rebuilt (npm run build:db)
- [ ] Scene appears in module

### Backend Upload
- [ ] Map record created in database
- [ ] All assets uploaded to S3
- [ ] File records created
- [ ] Tags assigned
- [ ] Published flag set

### Testing
- [ ] Map appears in gallery
- [ ] Download works
- [ ] All files download correctly
- [ ] Scene imports successfully
- [ ] Assets load in scene
- [ ] No missing files errors

---

## Troubleshooting

### Scene Won't Import
- Check mapId in scene flags matches database
- Verify scene is in compendium
- Check scene JSON is valid

### Assets Won't Download
- Verify S3 signed URLs are working
- Check file paths match exactly
- Ensure user has proper access level

### Paths Don't Resolve
- All paths must start with `modules/dorman-lakely-cartography/`
- Check capitalization (case-sensitive on Linux)
- Ensure folders exist

### Performance Issues
- Reduce image sizes
- Compress audio files
- Limit number of tiles
- Use WebP format

---

## Example: Complete Map Package

A complete map ready for distribution:

### In Module (Compendium)
```json
{
  "name": "Dungeon Depths",
  "background": {
    "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp"
  },
  "flags": {
    "dorman-lakely-cartography": {
      "mapId": "1",
      "slug": "dungeon-depths",
      "requiresDownload": true,
      "fileCount": 4,
      "totalSize": 3242880
    }
  }
}
```

### In Database
```ruby
FoundryMap.create!(
  id: 1,
  name: "Dungeon Depths",
  slug: "dungeon-depths",
  published: true,
  access_level: "premium"
)
```

### In S3
```
maps/1/abc123_background.webp
maps/1/def456_torch-1.webp
maps/1/ghi789_ambient.mp3
maps/1/jkl012_thumbnail.jpg
```

### User Downloads To
```
[Foundry Data]/modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/
├── background.webp
├── tiles/
│   └── torch-1.webp
└── audio/
    └── ambient.mp3
```

All paths work perfectly! ✅
