# frozen_string_literal: true

# Script to import 2024 magic items from the magic_items.json file

json_file = Rails.root.join('scripts', 'srd_parser', 'output', '2024', 'magic_items.json')

unless File.exist?(json_file)
  puts "Error: magic_items.json not found at #{json_file}"
  exit 1
end

puts 'Importing 2024 Magic Items...'

data = JSON.parse(File.read(json_file))
imported = 0
updated = 0
errors = 0

data.each do |attrs|
  name = attrs['name']
  slug = attrs['slug']
  item_type = attrs['type'] # MagicItem, MagicArmorItem, or MagicWeaponItem

  # Determine the correct model class
  model_class = case item_type
                when 'MagicArmorItem' then MagicArmorItem
                when 'MagicWeaponItem' then MagicWeaponItem
                else MagicItem
                end

  # Find or initialize by slug and edition
  item = model_class.find_or_initialize_by(slug: slug, edition: '2024')
  is_new = item.new_record?

  # Map attributes
  item.name = name
  item.equipment_category = attrs['equipment_category']
  item.rarity = attrs['rarity']&.downcase
  item.requires_attunement = attrs['requires_attunement'] ? 'requires attunement' : nil
  item.weight = attrs['weight']
  item.magic_item_type = attrs['item_subtype']

  # Handle description (array in JSON, string in model)
  desc_content = attrs['desc']
  item.desc = desc_content.is_a?(Array) ? desc_content.join("\n\n") : desc_content

  if item.save
    if is_new
      puts "  Imported: #{name} (#{item_type})"
      imported += 1
    else
      puts "  Updated: #{name} (#{item_type})"
      updated += 1
    end
  else
    puts "  Error importing #{name}: #{item.errors.full_messages.join(', ')}"
    errors += 1
  end
end

puts "\nDone! Imported: #{imported}, Updated: #{updated}, Errors: #{errors}"
