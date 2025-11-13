# Foundry Map File Format Guide

This document explains how to structure map data for the Dorman Lakely Cartography module.

## Overview

Each Foundry map consists of multiple files that need to be uploaded to S3 and registered in the database:

- **Scene JSON** - The Foundry scene configuration
- **Background Image** - The main map image
- **Tile Images** - Any tile overlays (optional)
- **Token Images** - Custom tokens for the map (optional)
- **Audio Files** - Ambient sounds or music (optional)
- **Thumbnail** - Preview image for the gallery

## File Types

### Supported File Types

| Type | Description | Extensions | Required |
|------|-------------|------------|----------|
| `scene` | Foundry scene JSON data | `.json` | ✅ Yes |
| `background` | Main map background image | `.jpg`, `.png`, `.webp` | ✅ Yes |
| `tile` | Tile overlay images | `.jpg`, `.png`, `.webp` | ❌ No |
| `token` | Token artwork | `.jpg`, `.png`, `.webp` | ❌ No |
| `audio` | Sound effects/music | `.mp3`, `.ogg`, `.wav` | ❌ No |
| `thumbnail` | Gallery preview | `.jpg`, `.png`, `.webp` | ✅ Yes |
| `other` | Any other assets | Any | ❌ No |

## Database Schema

### foundry_maps Table

```ruby
{
  id: 1,
  name: "Dungeon Depths",
  description: "A dark dungeon with multiple levels",
  thumbnail_url: "https://s3.../thumbnail.jpg",
  access_level: "premium",  # or "free"
  published: true,
  grid_size: 5,
  grid_units: "ft",
  width: 4000,
  height: 3000,
  keywords: ["dungeon", "cave", "underground"],
  download_count: 0
}
```

### foundry_map_files Table

```ruby
{
  id: 1,
  foundry_map_id: 1,
  file_path: "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/scene.json",
  file_type: "scene",
  file_size: 15420,
  s3_key: "maps/1/abc123_scene.json",
  content_type: "application/json"
}
```

## API Response Format

### GET /v1/maps/list

Returns array of maps:

```json
[
  {
    "id": "1",
    "name": "Dungeon Depths",
    "description": "A dark dungeon with multiple levels",
    "thumbnail": "https://s3.../thumbnail.jpg",
    "tags": ["dungeon", "underground", "combat"],
    "keywords": ["cave", "dark"],
    "access": "Premium",
    "gridSize": 5,
    "gridUnits": "ft",
    "resolution": {
      "width": 4000,
      "height": 3000
    },
    "createdAt": "2025-01-12T00:00:00Z",
    "updatedAt": "2025-01-12T00:00:00Z"
  }
]
```

### GET /v1/maps/files/:id

Returns file manifest for a map:

```json
{
  "mapId": "1",
  "files": [
    {
      "path": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/scene.json",
      "size": 15420,
      "type": "scene"
    },
    {
      "path": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp",
      "size": 2450000,
      "type": "background"
    },
    {
      "path": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/tiles/torch-1.webp",
      "size": 125000,
      "type": "tile"
    }
  ],
  "totalSize": 2590420
}
```

## File Organization in S3

Recommended S3 bucket structure:

```
your-bucket/
├── maps/
│   ├── 1/                          # Map ID
│   │   ├── abc123_scene.json       # Scene data
│   │   ├── def456_background.webp  # Background image
│   │   ├── ghi789_tile-1.webp      # Tile images
│   │   ├── jkl012_ambient.mp3      # Audio
│   │   └── mno345_thumbnail.jpg    # Thumbnail
│   └── 2/
│       └── ...
└── images/
    └── thumbnails/                 # Public thumbnails
        └── dungeon-depths.jpg
```

## File Naming Conventions

### Automatic Type Detection

The system automatically detects file types based on filename patterns:

- Files containing `scene` + `.json` → `scene`
- Files containing `thumbnail` or `preview` → `thumbnail`
- Files containing `background` or `map` → `background`
- Files containing `tile` → `tile`
- Files containing `token` → `token`
- Extensions `.mp3`, `.ogg`, `.wav` → `audio`
- Other images default to → `background`

### Recommended Naming

```
dungeon-depths-scene.json         → type: scene
dungeon-depths-background.webp    → type: background
dungeon-depths-tile-torch.webp    → type: tile
dungeon-depths-token-goblin.png   → type: token
dungeon-depths-ambient.mp3        → type: audio
dungeon-depths-thumbnail.jpg      → type: thumbnail
```

## Upload Process

### 1. Upload to S3

```ruby
# Example upload
s3_client = Aws::S3::Client.new(
  region: ENV['AWS_REGION'],
  access_key_id: ENV['AWS_ACCESS_KEY_ID'],
  secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
)

s3_client.put_object(
  bucket: ENV['AWS_S3_BUCKET'],
  key: "maps/1/#{SecureRandom.uuid}_scene.json",
  body: file.read,
  content_type: 'application/json'
)
```

### 2. Create Database Records

```ruby
# Create the map
map = FoundryMap.create!(
  name: "Dungeon Depths",
  description: "A dark dungeon",
  thumbnail_url: "https://s3.../thumbnail.jpg",
  access_level: "premium",
  published: true,
  grid_size: 5,
  grid_units: "ft",
  width: 4000,
  height: 3000
)

# Add files
map.foundry_map_files.create!(
  file_path: "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/scene.json",
  file_type: "scene",
  file_size: 15420,
  s3_key: "maps/1/abc123_scene.json"
)

# Add tags
map.foundry_map_tags = FoundryMapTag.where(name: ["Dungeon", "Combat", "Underground"])
```

## Scene JSON Structure

The scene JSON should be a valid Foundry VTT scene export:

```json
{
  "name": "Dungeon Depths",
  "background": {
    "src": "modules/dorman-lakely-cartography/assets/scenes/dungeon-depths/background.webp"
  },
  "width": 4000,
  "height": 3000,
  "grid": {
    "type": 1,
    "size": 140,
    "distance": 5,
    "units": "ft"
  },
  "walls": [...],
  "lights": [...],
  "sounds": [...],
  "tiles": [...]
}
```

## Testing Checklist

- [ ] Map appears in gallery
- [ ] Thumbnail loads correctly
- [ ] Tags display properly
- [ ] Access level is correct (Free/Premium)
- [ ] Download button appears
- [ ] All files download successfully
- [ ] Scene imports into Foundry correctly
- [ ] Background image displays
- [ ] Tiles load properly
- [ ] Audio plays (if included)
- [ ] Grid settings are correct

## Common Issues

### Files Not Downloading
- Check S3 permissions
- Verify signed URLs are being generated
- Check file_path matches actual S3 key

### Scene Won't Import
- Validate scene JSON structure
- Ensure file paths in JSON match downloaded paths
- Check grid settings

### Missing Assets
- Verify all referenced files are in the manifest
- Check file types are correct
- Ensure S3 keys are unique

## Admin Upload UI

The admin UI at `/v1/maps-admin` allows you to:
1. Create new maps
2. Upload multiple files at once
3. Set tags and metadata
4. Preview before publishing
5. Manage access levels
