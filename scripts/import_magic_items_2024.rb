# frozen_string_literal: true

# Script to import 2024 magic items from SRD_5.2.1_Magic_Items_import.json
# This file contains clean, properly structured data for all 326 magic items
#
# Note: We use MagicItem for all items to avoid STI type conflicts with existing
# records. The magic_item_type field stores the category (Armor, Weapon, etc.)

json_file = Rails.root.join('scripts/SRD_5.2.1_Magic_Items_import.json')

unless File.exist?(json_file)
  puts "Error: SRD_5.2.1_Magic_Items_import.json not found at #{json_file}"
  exit 1
end

puts 'Importing 2024 Magic Items from SRD 5.2.1...'

data = JSON.parse(File.read(json_file))
items = data['items']

puts "Found #{items.length} items to import"

imported = 0
updated = 0
errors = 0

# rubocop:disable Metrics/BlockLength
items.each do |attrs|
  name = attrs['name']
  base_slug = attrs['slug']
  magic_item_type = attrs['magic_item_type']

  # Append -2024 to make slugs unique between editions
  slug = "#{base_slug}-2024"

  # Use MagicItem for all to avoid STI type conflicts
  # First try to find existing item by slug (regardless of type)
  item = Item.find_by(slug: slug, edition: '2024')

  if item
    is_new = false
  else
    item = MagicItem.new(slug: slug, edition: '2024')
    is_new = true
  end

  # Map common attributes
  item.name = name
  item.equipment_category = attrs['equipment_category']
  item.rarity = attrs['rarity']&.downcase
  item.weight = attrs['weight']
  item.magic_item_type = magic_item_type

  # Handle attunement - convert "true" string to proper format
  attunement = attrs['requires_attunement']
  item.requires_attunement = if attunement == 'true'
                               'requires attunement'
                             elsif attunement.is_a?(String) && attunement.length > 4
                               # Handle cases like "requires attunement by a sorcerer"
                               attunement
                             end

  # Set type-specific attributes
  case magic_item_type
  when 'Armor'
    item.armor_category = attrs['armor_category']
  when 'Weapon'
    # Use weapon_category as category_range for display
    item.category_range = attrs['weapon_category']
  end

  # Description is already a clean array
  item.desc = attrs['desc']

  if item.save
    if is_new
      puts "  Imported: #{name} (#{magic_item_type})"
      imported += 1
    else
      puts "  Updated: #{name} (#{magic_item_type})"
      updated += 1
    end
  else
    puts "  Error importing #{name}: #{item.errors.full_messages.join(', ')}"
    errors += 1
  end
end
# rubocop:enable Metrics/BlockLength

puts "\nDone! Imported: #{imported}, Updated: #{updated}, Errors: #{errors}"
puts "Total magic items in database: #{MagicItem.where(edition: '2024').count}"
