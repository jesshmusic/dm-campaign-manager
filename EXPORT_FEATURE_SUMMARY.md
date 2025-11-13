# Scene Export Feature - Quick Reference

## What's New?

The Dorman Lakely Cartography module now includes a **built-in right-click export feature** for exporting scenes directly from Foundry VTT!

## How to Use

### Step 1: In Foundry VTT

1. Open Foundry with the **Dorman Lakely Cartography** module enabled
2. Go to the **Scenes Directory** (map icon in left sidebar)
3. **Right-click** on any scene you want to export
4. Select **"Export for Dorman Lakely Cartography"** from the context menu
5. Watch the progress notifications as it packages your scene
6. A ZIP file downloads automatically to your browser's download folder

### Step 2: In Rails Admin

1. Open http://localhost:3000/v1/maps-admin
2. Click **"New Map"** or edit an existing map
3. Fill in the map details:
   - Name
   - Description (rich text with images)
   - Tags
   - Access Level (Free/Premium)
   - Published status
4. In the **"Upload Scene Package"** section, click the file input
5. Select the ZIP file you just exported from Foundry
6. Click **"Create Map"** or **"Update Map"**

### Step 3: Automatic Processing

The system automatically:
- ✅ Extracts all files from the ZIP
- ✅ Updates asset paths in scene.json
- ✅ Uploads everything to S3/Cloudflare R2
- ✅ Creates database records for each file
- ✅ Makes the map available in the module gallery

### Step 4: Done!

Your map is now available for download in the Foundry module gallery!

---

## What Gets Exported?

The ZIP package contains:

```
my-awesome-map-package.zip
├── scene.json          # Scene configuration (walls, lights, etc.)
├── background.webp     # Main map image
├── tiles/              # All tile overlays
│   ├── torch-1.webp
│   └── door.png
├── tokens/             # All token images (if any)
│   └── goblin.png
└── audio/              # All sound files (if any)
    └── ambient.mp3
```

---

## Features

### For Content Creators:
- ✅ **No console commands** - Just right-click!
- ✅ **Progress notifications** - See exactly what's happening
- ✅ **Automatic organization** - Files sorted into proper folders
- ✅ **Complete package** - Everything in one ZIP
- ✅ **Fast export** - Efficient concurrent downloads

### For End Users:
- ✅ **Beautiful gallery** - Browse maps with thumbnails and descriptions
- ✅ **Tag filtering** - Find maps by category
- ✅ **Access control** - Free and Premium tiers
- ✅ **Smart downloads** - Only downloads missing files
- ✅ **Auto-import** - Scene ready to use immediately

---

## Technical Details

### Files Created:

1. **Frontend Module:**
   - `src/services/scene-exporter.ts` - Export service class
   - `src/main.ts` - Context menu hook integration

2. **Backend Rails:**
   - `app/controllers/admin/v1/foundry_maps_controller.rb`
     - `upload_package` endpoint
     - `process_scene_package` method
     - `update_scene_paths` method
     - `upload_map_file` method

3. **Admin UI:**
   - Updated form to accept only ZIP files
   - Added detailed instructions with both methods
   - Shows file size when ZIP is selected

### API Endpoints:

- `POST /v1/maps/:id/upload_package` - Accepts ZIP file, processes and uploads

### Build System:

- Module built with Vite + TypeScript
- Build #51+ includes the export feature
- Run `npm run build` to rebuild after changes

---

## Context Menu Details

### Hook Used:
`getSceneDirectoryEntryContext` - Fires when right-clicking a scene

### Menu Item:
- **Name:** "Export for Dorman Lakely Cartography"
- **Icon:** 📦 (file-archive)
- **Condition:** Only shows for scenes (not folders), only for GMs
- **Callback:** Calls `SceneExporter.exportScene(scene)`

### Requirements:
- User must be a GM
- JSZip must be available (bundled with Foundry)
- Module must be enabled

---

## Fallback Methods

If the right-click option doesn't appear:

### Method 1: Check Module Status
- Ensure Dorman Lakely Cartography is enabled in Module Settings
- Refresh Foundry (F5) after enabling
- Check browser console for errors

### Method 2: Use Console Script
- Open browser console (F12)
- Load the export script from `scripts/export-scene-package.js`
- Run: `exportScenePackage("Scene Name")`

### Method 3: Manual Export
- Follow the guide in `FOUNDRY_MAP_UPLOAD_GUIDE.md`
- Export scene JSON separately
- Organize files manually
- Use the old upload endpoint

---

## Troubleshooting

### "Export option not showing in context menu"
- Verify you're logged in as GM
- Check that module is enabled
- Look for console errors (F12)
- Try refreshing Foundry

### "JSZip not available"
- JSZip is included with Foundry v10+
- Update Foundry if using older version
- Check browser console for specific errors

### "Export fails during download"
- Check that all assets are accessible
- Look for 404 errors in browser Network tab
- Verify file permissions on asset folders
- Try exporting a simpler scene first

### "Assets are missing after download"
- Check that files exist at expected paths
- Verify S3 bucket permissions
- Look at Rails logs for upload errors
- Test with smaller files first

---

## Testing the Feature

### Quick Test:

1. **In Foundry:**
   ```
   1. Create a simple test scene
   2. Add a background image
   3. Add 1-2 tiles or tokens
   4. Right-click → Export for DLC
   5. Verify ZIP downloads
   ```

2. **In Rails Admin:**
   ```
   1. Navigate to /v1/maps-admin
   2. Create new map
   3. Upload the ZIP
   4. Check that files appear in the files list
   ```

3. **In Module Gallery:**
   ```
   1. Open Scenes Directory in Foundry
   2. Click "Dorman Lakely Cartography" button
   3. Find your test map
   4. Click Download
   5. Verify scene imports correctly
   ```

### Full Integration Test:

1. Create a complex scene with:
   - Background (4000x3000px)
   - 10+ tiles
   - 5+ tokens
   - 2+ ambient sounds
   - Walls and lighting

2. Export via right-click

3. Upload to admin

4. Publish map

5. Download from gallery

6. Verify:
   - All images load
   - Tiles positioned correctly
   - Tokens appear
   - Audio plays
   - Walls work
   - Lighting works

---

## Next Steps

### For Development:
- [ ] Add progress dialog with file-by-file progress
- [ ] Add option to exclude tokens/audio
- [ ] Add thumbnail auto-generation
- [ ] Add batch export for multiple scenes
- [ ] Add export presets (quality settings)

### For Documentation:
- [ ] Create video tutorial
- [ ] Add screenshots to docs
- [ ] Create troubleshooting guide
- [ ] Add FAQ section

### For Distribution:
- [ ] Test on FoundryVTT v11, v12, v13
- [ ] Test with different file formats (JPEG, PNG, WEBP)
- [ ] Test with large scenes (10+ MB)
- [ ] Test with many assets (100+ files)

---

## Support

For issues:
1. Check browser console (F12) for errors
2. Check Rails logs: `tail -f log/development.log`
3. Review this documentation
4. Check GitHub issues
5. Contact via Discord/Patreon
