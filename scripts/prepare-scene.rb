#!/usr/bin/env ruby
# frozen_string_literal: true

# Scene Preparation Script
# Usage: ruby scripts/prepare-scene.rb path/to/scene.json map-slug-name

require 'json'
require 'fileutils'

# ANSI color codes
RED = "\e[31m"
GREEN = "\e[32m"
YELLOW = "\e[33m"
BLUE = "\e[34m"
RESET = "\e[0m"

def log_info(msg)
  puts "#{BLUE}ℹ #{msg}#{RESET}"
end

def log_success(msg)
  puts "#{GREEN}✓ #{msg}#{RESET}"
end

def log_warning(msg)
  puts "#{YELLOW}⚠ #{msg}#{RESET}"
end

def log_error(msg)
  puts "#{RED}✗ #{msg}#{RESET}"
end

# Check arguments
if ARGV.length < 2
  log_error 'Usage: ruby prepare-scene.rb <scene.json> <map-slug>'
  log_info 'Example: ruby prepare-scene.rb dungeon.json dungeon-depths'
  exit 1
end

scene_file = ARGV[0]
map_slug = ARGV[1]

# Validate input file
unless File.exist?(scene_file)
  log_error "Scene file not found: #{scene_file}"
  exit 1
end

# Validate map slug
unless map_slug.match?(/^[a-z0-9-]+$/)
  log_error 'Invalid map slug. Use only lowercase letters, numbers, and hyphens.'
  log_info 'Example: dungeon-depths, forest-clearing, castle-throne-room'
  exit 1
end

log_info "Preparing scene: #{scene_file}"
log_info "Map slug: #{map_slug}"

# Read and parse JSON
begin
  scene_data = JSON.parse(File.read(scene_file))
rescue JSON::ParserError => e
  log_error "Invalid JSON: #{e.message}"
  exit 1
end

# Base path for module assets
base_path = "modules/dorman-lakely-cartography/assets/scenes/#{map_slug}"

# Track changes
changes = []
warnings = []

# Function to update paths recursively
def update_paths(obj, base_path, changes, warnings, path = [])
  case obj
  when Hash
    obj.each do |key, value|
      # Check for path keys
      if %w[src path sound img icon texture].include?(key)
        if value.is_a?(String) && !value.start_with?('modules/dorman-lakely-cartography')
          old_value = value

          # Extract filename from original path
          filename = File.basename(value)

          # Determine subdirectory based on context
          subdir = if path.include?('tiles')
                     'tiles'
                   elsif path.include?('tokens')
                     'tokens'
                   elsif path.include?('sounds')
                     'audio'
                   elsif key == 'sound'
                     'audio'
                   elsif value.include?('token')
                     'tokens'
                   elsif value.include?('tile')
                     'tiles'
                   else
                     ''
                   end

          # Build new path
          new_path = if subdir.empty?
                       "#{base_path}/#{filename}"
                     else
                       "#{base_path}/#{subdir}/#{filename}"
                     end

          obj[key] = new_path
          changes << { from: old_value, to: new_path }
        end
      elsif value.is_a?(Hash) || value.is_a?(Array)
        update_paths(value, base_path, changes, warnings, path + [key])
      end
    end
  when Array
    obj.each_with_index do |item, index|
      update_paths(item, base_path, changes, warnings, path + [index]) if item.is_a?(Hash) || item.is_a?(Array)
    end
  end
end

# Update all paths
log_info 'Updating asset paths...'
update_paths(scene_data, base_path, changes, warnings)

# Report changes
if changes.empty?
  log_warning 'No paths needed updating. Scene may already be prepared.'
else
  log_success "Updated #{changes.length} asset paths"

  # Show first few changes as examples
  log_info "\nPath changes (showing first 5):"
  changes.first(5).each do |change|
    puts "  #{YELLOW}#{File.basename(change[:from])}#{RESET}"
    puts "    → #{GREEN}#{change[:to]}#{RESET}"
  end

  log_info "  ... and #{changes.length - 5} more" if changes.length > 5
end

# Create backup
backup_file = "#{scene_file}.backup"
FileUtils.cp(scene_file, backup_file)
log_success "Created backup: #{backup_file}"

# Write updated JSON
output_file = scene_file.gsub(/\.json$/, '-prepared.json')
File.write(output_file, JSON.pretty_generate(scene_data))
log_success "Wrote prepared scene: #{output_file}"

# Generate file list
log_info "\nExpected file structure:"
puts "  #{base_path}/"
puts '  ├── scene.json (this file)'
puts '  ├── background.webp'

# Extract unique subdirectories
subdirs = changes.map { |c| File.dirname(c[:to]).split('/').last }.uniq.compact
subdirs.each do |subdir|
  next if subdir == map_slug

  puts "  ├── #{subdir}/"
  subdir_files = changes.select { |c| c[:to].include?("/#{subdir}/") }
  subdir_files.first(3).each do |change|
    puts "  │   └── #{File.basename(change[:to])}"
  end
  puts '  │   └── ...' if subdir_files.length > 3
end

puts '  └── thumbnail.jpg'

# Generate migration checklist
puts "\n#{BLUE}━━━ Next Steps ━━━#{RESET}"
puts "1. Review the prepared scene: #{output_file}"
puts '2. Organize your files in this structure:'
puts "   #{map_slug}/"
puts "   ├── #{File.basename(output_file)} → rename to scene.json"
puts '   ├── background.webp'
puts '   ├── tiles/ (if applicable)'
puts '   ├── tokens/ (if applicable)'
puts '   ├── audio/ (if applicable)'
puts '   └── thumbnail.jpg'
puts ''
puts '3. Upload via admin UI: http://localhost:3000/v1/maps-admin'
puts '   OR'
puts "   Use the upload script: ./scripts/upload-map.sh #{map_slug}/"
puts ''

log_success 'Scene preparation complete!'
