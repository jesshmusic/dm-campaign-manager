# frozen_string_literal: true

# Script to import 2024 magic items from the magic_items.json file
# Handles poorly parsed PDF data by extracting rarity/attunement from description

json_file = Rails.root.join('scripts', 'srd_parser', 'output', '2024', 'magic_items.json')

unless File.exist?(json_file)
  puts "Error: magic_items.json not found at #{json_file}"
  exit 1
end

# Rarity data from SRD 5.2.1 (fallback for items where JSON rarity is null)
MAGIC_ITEM_RARITY = {
  'Amulet of Health' => { rarity: 'rare', attunement: 'requires attunement' },
  'Animated Shield' => { rarity: 'very rare', attunement: 'requires attunement' },
  'Apparatus of the Crab' => { rarity: 'legendary', attunement: nil },
  'Armor, +1, +2, or +3' => { rarity: 'rare', attunement: nil },
  'Armor of Vulnerability' => { rarity: 'rare', attunement: 'requires attunement' },
  'Bag of Devouring' => { rarity: 'very rare', attunement: nil },
  'Bag of Tricks' => { rarity: 'uncommon', attunement: nil },
  'Bead of Force' => { rarity: 'rare', attunement: nil },
  'Berserker Axe' => { rarity: 'rare', attunement: 'requires attunement' },
  'Boots of Speed' => { rarity: 'rare', attunement: 'requires attunement' },
  'Bracers of Defense' => { rarity: 'rare', attunement: 'requires attunement' },
  'Cape of the Mountebank' => { rarity: 'rare', attunement: nil },
  'Censer of Controlling Air Elementals' => { rarity: 'rare', attunement: nil },
  'Chime of Opening' => { rarity: 'rare', attunement: nil },
  'Crystal Ball of True Seeing' => { rarity: 'legendary', attunement: 'requires attunement' },
  'Cubic Gate' => { rarity: 'legendary', attunement: nil },
  'Dancing Sword' => { rarity: 'very rare', attunement: 'requires attunement' },
  'Defender' => { rarity: 'legendary', attunement: 'requires attunement' },
  'Dragon Slayer' => { rarity: 'rare', attunement: nil },
  'Efreeti Bottle' => { rarity: 'very rare', attunement: nil },
  'Elemental Gem' => { rarity: 'uncommon', attunement: nil },
  'Elixir of Health' => { rarity: 'rare', attunement: nil },
  'Elven Chain' => { rarity: 'rare', attunement: nil },
  'Figurine of Wondrous Power' => { rarity: 'rare', attunement: nil },
  'Flame Tongue' => { rarity: 'rare', attunement: 'requires attunement' },
  'Gauntlets of Ogre Power' => { rarity: 'uncommon', attunement: 'requires attunement' },
  'Headband of Intellect' => { rarity: 'uncommon', attunement: 'requires attunement' },
  'Horseshoes of a Zephyr' => { rarity: 'very rare', attunement: nil },
  'Horseshoes of Speed' => { rarity: 'rare', attunement: nil },
  'Ioun Stone' => { rarity: 'rare', attunement: 'requires attunement' },
  'Iron Flask' => { rarity: 'legendary', attunement: nil },
  'Manual of Quickness of Action' => { rarity: 'very rare', attunement: nil },
  'Mirror of Life Trapping' => { rarity: 'very rare', attunement: nil },
  'Mithral Armor' => { rarity: 'uncommon', attunement: nil },
  'Necklace of Adaptation' => { rarity: 'uncommon', attunement: 'requires attunement' },
  'Necklace of Fireballs' => { rarity: 'rare', attunement: nil },
  'Nine Lives Stealer' => { rarity: 'very rare', attunement: 'requires attunement' },
  'Oathbow' => { rarity: 'very rare', attunement: 'requires attunement' },
  'Potion of Diminution' => { rarity: 'rare', attunement: nil },
  'Potions of Healing' => { rarity: 'common', attunement: nil },
  'Potion of Mind Reading' => { rarity: 'rare', attunement: nil },
  'Potion, Uncommon' => { rarity: 'uncommon', attunement: nil },
  'Ring, Legendary (Requires Attunement)' => { rarity: 'legendary', attunement: 'requires attunement' },
  'Robe of the Archmagi' => { rarity: 'legendary', attunement: 'requires attunement by a sorcerer, warlock, or wizard' },
  'Shield, +1, +2, or +3' => { rarity: 'uncommon', attunement: nil },
  'Slippers of Spider Climbing' => { rarity: 'uncommon', attunement: 'requires attunement' },
  'Staff of Charming' => { rarity: 'rare', attunement: 'requires attunement by a bard, cleric, druid, sorcerer, warlock, or wizard' },
  'Staff of Frost' => { rarity: 'very rare', attunement: 'requires attunement by a druid, sorcerer, warlock, or wizard' },
  'Staff of the Woodlands' => { rarity: 'rare', attunement: 'requires attunement by a druid' },
  'Thunderous Greatclub' => { rarity: 'very rare', attunement: nil },
  'Wand of Binding' => { rarity: 'rare', attunement: 'requires attunement by a spellcaster' },
  'Wand of Polymorph' => { rarity: 'very rare', attunement: 'requires attunement by a spellcaster' },
  'Weapon, +1, +2, or +3' => { rarity: 'uncommon', attunement: nil },
  'Wind Fan' => { rarity: 'uncommon', attunement: nil }
}.freeze

# Weapon category data (melee vs ranged)
MAGIC_WEAPON_CATEGORIES = {
  'Berserker Axe' => 'Melee',
  'Dancing Sword' => 'Melee',
  'Defender' => 'Melee',
  'Dragon Slayer' => 'Melee',
  'Flame Tongue' => 'Melee',
  'Nine Lives Stealer' => 'Melee',
  'Oathbow' => 'Ranged',
  'Thunderous Greatclub' => 'Melee',
  'Weapon, +1, +2, or +3' => 'Melee'
}.freeze

def clean_description(desc_array)
  return [] unless desc_array.is_a?(Array)

  full_text = desc_array.join(' ')

  # Remove leading weapon type fragments like "hortsword)", "Longsword)," etc.
  full_text = full_text.gsub(/^[a-zA-Z]*sword\),?\s*/i, '')
  full_text = full_text.gsub(/^[a-zA-Z]*axe\),?\s*/i, '')
  full_text = full_text.gsub(/^[a-zA-Z]*bow\),?\s*/i, '')

  # Remove rarity/attunement prefix from description
  full_text = full_text.gsub(/^(Common|Uncommon|Rare|Very Rare|Legendary)\s*(\(Requires Attunement[^)]*\))?\s*/i, '')

  # Fix hyphenated line breaks
  full_text = full_text.gsub(/(\w+)-\s+(\w+)/, '\1\2')

  # Remove trailing item names that bled in from PDF parsing
  # Keep text before the bleed-in and try to preserve any words that follow the item name
  bleeding_items = [
    'Decanter of Endless Water',
    'Demon Armor',
    'Arrow-Catching Shield',
    'Aceprptaariant luesv oefr sth aer Ce ruasbed',
    'Ring of Protection'
  ]
  bleeding_items.each do |item_name|
    # If the bleed has text after it (like "from it."), try to preserve it
    if full_text.include?(item_name)
      parts = full_text.split(item_name)
      # Keep text before the bleed
      before = parts[0]&.strip || ''
      # If there's text after, see if it makes sense to keep (short words like "from it")
      after = parts[1]&.strip || ''
      if after.length < 20 && after =~ /^(from|to|of|in|on|at|by|for)\s/i
        full_text = "#{before} #{after}"
      else
        full_text = before
      end
    end
  end

  # Clean up extra whitespace
  full_text = full_text.gsub(/\s+/, ' ').strip

  # Split into reasonable paragraphs (split on double spaces or period followed by capital)
  paragraphs = full_text.split(/(?<=[.!?])\s+(?=[A-Z])/)
  paragraphs.map(&:strip).reject(&:empty?)
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

  # Get rarity/attunement from our data (more reliable than JSON)
  rarity_data = MAGIC_ITEM_RARITY[name] || {}
  rarity = rarity_data[:rarity] || attrs['rarity']&.downcase
  attunement = rarity_data[:attunement]

  # Map attributes
  item.name = name
  item.equipment_category = attrs['equipment_category']
  item.rarity = rarity
  item.requires_attunement = attunement
  item.weight = attrs['weight']
  item.magic_item_type = attrs['item_subtype']

  # Set category_range for magic weapons
  if item_type == 'MagicWeaponItem'
    item.category_range = MAGIC_WEAPON_CATEGORIES[name] || 'Melee'
  end

  # Clean and store description as array (view expects array)
  cleaned_desc = clean_description(attrs['desc'])
  item.desc = cleaned_desc

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
