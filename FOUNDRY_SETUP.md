# Dorman Lakely Cartography - Local Development Setup

This guide will help you set up the complete system locally for development and testing.

## Architecture Overview

```
┌──────────────────┐      HTTP      ┌─────────────────────┐
│  FoundryVTT      │  ────────────> │  Rails Backend      │
│  Module          │  <────────────  │  (localhost:3000)   │
│  (localhost:30000)│                 │                     │
└──────────────────┘                 └─────────────────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   AWS S3        │
                                     │   (Map Files)   │
                                     └─────────────────┘
```

## Prerequisites

- **Ruby**: 3.2.2 (check with `ruby -v`)
- **PostgreSQL**: 12+ (check with `psql --version`)
- **Node.js**: 18+ (check with `node -v`)
- **Yarn**: 1.22+ (check with `yarn -v`)
- **FoundryVTT**: v13+ installed locally
- **AWS Account**: With S3 bucket created

## Part 1: Rails Backend Setup

### 1. Install Dependencies

```bash
cd /Users/jesshendricks/Code/dungeon-master-guru

# Install Ruby gems
bundle install

# Install Node packages
yarn install
```

### 2. Configure Environment Variables

Edit `.env` file with your actual AWS and Patreon credentials:

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_actual_access_key
AWS_SECRET_ACCESS_KEY=your_actual_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=dorman-lakely-maps

# Patreon OAuth Configuration
PATREON_CLIENT_ID=your_patreon_client_id
PATREON_CLIENT_SECRET=your_patreon_client_secret
PATREON_REDIRECT_URI=http://localhost:3000/v1/patreon/callback
```

**How to get AWS credentials:**
1. Go to [AWS IAM Console](https://console.aws.amazon.com/iam/)
2. Create new user with **S3 permissions**
3. Save Access Key ID and Secret Access Key

**How to get Patreon credentials:**
1. Go to [Patreon Developers](https://www.patreon.com/portal/registration/register-clients)
2. Create new client
3. Set redirect URI: `http://localhost:3000/v1/patreon/callback`
4. Copy Client ID and Client Secret

### 3. Create S3 Bucket

```bash
# Using AWS CLI (install if needed: brew install awscli)
aws configure  # Enter your AWS credentials

# Create bucket
aws s3 mb s3://dorman-lakely-maps --region us-east-1

# Set bucket to private
aws s3api put-public-access-block \
  --bucket dorman-lakely-maps \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 4. Database Setup

```bash
# Create database
rails db:create

# Run migrations
rails db:migrate

# (Optional) Seed with sample data
rails db:seed
```

### 5. Start Rails Server

```bash
# Start server on port 3000
rails server

# Or use Foreman to start all processes
foreman start -f Procfile.dev
```

**Verify it's working:**
- Visit http://localhost:3000
- You should see the Dungeon Master Guru homepage

## Part 2: FoundryVTT Module Setup

### 1. Build the Module

```bash
cd /Users/jesshendricks/Code/dorman-lakely-cartography

# Install dependencies
npm install

# Build the module
npm run build
```

### 2. Symlink to FoundryVTT

```bash
# Create symlink in Foundry's modules directory
ln -s \
  "/Users/jesshendricks/Code/dorman-lakely-cartography" \
  "/Users/jesshendricks/Library/Application Support/FoundryVTT/Data/modules/dorman-lakely-cartography"
```

### 3. Enable Module in Foundry

1. Start FoundryVTT
2. Create or open a world
3. Go to **Settings → Manage Modules**
4. Enable:
   - **Dorman Lakely Cartography**
   - **Tagger** (required dependency)
   - **Monk's Active Tiles** (required dependency)
5. Click **Save Module Settings**

### 4. Test the Connection

1. In Foundry, go to **Compendium Directory**
2. Click the **"Dorman Lakely Cartography"** button in the sidebar
3. The gallery should open and attempt to load from `http://localhost:3000`
4. Check browser console for any errors (F12 → Console tab)

## Part 3: Testing the Complete Flow

### 1. Create a Test Map in Rails

Open Rails console:

```bash
rails console
```

```ruby
# Create tags
dungeon_tag = FoundryMapTag.create!(name: 'Dungeon', slug: 'dungeon')
cave_tag = FoundryMapTag.create!(name: 'Cave', slug: 'cave')

# Create a test map
map = FoundryMap.create!(
  name: 'Test Dungeon',
  description: 'A test dungeon for development',
  thumbnail_url: 'https://via.placeholder.com/400x300',
  access_level: 'free',
  published: true,
  grid_size: 5,
  grid_units: 'ft',
  width: 4000,
  height: 3000,
  keywords: ['dark', 'underground']
)

# Add tags
map.foundry_map_tags << [dungeon_tag, cave_tag]

# Create a test file entry (you'll need to upload actual file to S3)
map.foundry_map_files.create!(
  file_path: 'modules/dorman-lakely-cartography/assets/scenes/test-dungeon/scene.json',
  file_type: 'scene',
  file_size: 1024,
  s3_key: 'scenes/test-dungeon/scene.json',
  content_type: 'application/json'
)

puts "Test map created! ID: #{map.id}"
```

### 2. Upload File to S3

```bash
# Create a test scene.json file
echo '{"name":"Test Scene"}' > /tmp/scene.json

# Upload to S3
aws s3 cp /tmp/scene.json \
  s3://dorman-lakely-maps/scenes/test-dungeon/scene.json \
  --content-type application/json
```

### 3. Test API Endpoints

```bash
# Test tags endpoint
curl http://localhost:3000/v1/maps/tags

# Test maps list
curl http://localhost:3000/v1/maps/list

# Test file manifest (replace MAP_ID with actual ID)
curl -H "Authorization: test-user-123" \
  http://localhost:3000/v1/maps/files/1
```

### 4. Test Patreon OAuth (Optional)

1. Make sure your Patreon app's redirect URI is set to:
   ```
   http://localhost:3000/v1/patreon/callback
   ```

2. In Foundry, click "Login with Patreon" in the gallery

3. You should be redirected to Patreon, then back to localhost:3000

4. Check the PatreonUser was created:
   ```ruby
   rails console
   PatreonUser.last
   ```

## Part 4: Development Workflow

### Watch Mode for Module Development

```bash
cd /Users/jesshendricks/Code/dorman-lakely-cartography

# Watch for changes and rebuild automatically
npm run watch
```

Refresh Foundry (F5) after changes to see updates.

### Check Rails Logs

```bash
# In rails directory
tail -f log/development.log
```

### Reset Database (if needed)

```bash
rails db:drop db:create db:migrate
```

## Part 5: Admin UI for Map Management

### Access Admin Interface

1. Visit http://localhost:3000/v1/dashboard
2. Create maps using the API or console (UI coming soon)

### Upload Maps via Console

```ruby
rails console

# Upload map files to S3 and create database records
# Example helper method (you can add this to lib/tasks)

def create_map_from_files(name, files_dir)
  map = FoundryMap.create!(
    name: name,
    published: true,
    access_level: 'free'
  )

  Dir.glob("#{files_dir}/**/*").each do |file_path|
    next unless File.file?(file_path)

    # Upload to S3
    s3_key = "scenes/#{map.id}/#{File.basename(file_path)}"
    s3 = Aws::S3::Resource.new
    obj = s3.bucket(ENV['AWS_S3_BUCKET']).object(s3_key)
    obj.upload_file(file_path)

    # Create database record
    map.foundry_map_files.create!(
      file_path: "modules/dorman-lakely-cartography/assets/scenes/#{map.name.parameterize}/#{File.basename(file_path)}",
      file_type: File.extname(file_path) == '.json' ? 'scene' : 'asset',
      file_size: File.size(file_path),
      s3_key: s3_key,
      content_type: `file --mime-type -b #{file_path}`.strip
    )
  end

  map
end

# Usage:
create_map_from_files('My Cool Dungeon', '/path/to/map/files')
```

## Troubleshooting

### Rails server won't start
- Check PostgreSQL is running: `pg_isready`
- Check port 3000 is free: `lsof -i :3000`

### Module not appearing in Foundry
- Check symlink exists: `ls -la "/Users/jesshendricks/Library/Application Support/FoundryVTT/Data/modules/"`
- Verify module.json is valid JSON
- Check Foundry logs in `logs/` directory

### CORS errors
- Ensure `rack-cors` gem is installed: `bundle list | grep rack-cors`
- Check `config/initializers/cors.rb` exists
- Restart Rails server after adding CORS config

### S3 upload fails
- Verify AWS credentials in .env
- Check bucket name is correct
- Test AWS CLI: `aws s3 ls s3://dorman-lakely-maps`

### Patreon auth doesn't work
- Check redirect URI matches exactly in Patreon app settings
- Verify PATREON_CLIENT_ID and SECRET are correct
- Check Rails logs for OAuth errors

## Next Steps

1. **Create actual map content** - Upload your scenes to S3
2. **Build admin UI** - React interface for managing maps
3. **Test downloads** - Try downloading a map in Foundry
4. **Deploy to production** - Set up on Heroku/Railway with production S3

## Useful Commands

```bash
# Rails console
rails console

# Check routes
rails routes | grep foundry

# Run tests
rspec

# Check code style
rubocop

# Database console
rails dbconsole

# Clear Rails cache
rails tmp:clear
```
