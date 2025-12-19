# frozen_string_literal: true

# Script to update 2024 general magic items with rarity and attunement data from SRD 5.2.1

MAGIC_ITEMS_DATA = {
  'Amulet of Health' => { rarity: 'rare', attunement: 'requires attunement' },
  'Apparatus of the Crab' => { rarity: 'legendary', attunement: nil },
  'Bag of Devouring' => { rarity: 'very rare', attunement: nil },
  'Bag of Tricks' => { rarity: 'uncommon', attunement: nil },
  'Bead of Force' => { rarity: 'rare', attunement: nil },
  'Boots of Speed' => { rarity: 'rare', attunement: 'requires attunement' },
  'Bracers of Defense' => { rarity: 'rare', attunement: 'requires attunement' },
  'Cape of the Mountebank' => { rarity: 'rare', attunement: nil },
  'Censer of Controlling Air Elementals' => { rarity: 'rare', attunement: nil },
  'Chime of Opening' => { rarity: 'rare', attunement: nil },
  'Crystal Ball of True Seeing' => { rarity: 'legendary', attunement: 'requires attunement' },
  'Cubic Gate' => { rarity: 'legendary', attunement: nil },
  'Efreeti Bottle' => { rarity: 'very rare', attunement: nil },
  'Elemental Gem' => { rarity: 'uncommon', attunement: nil },
  'Elixir of Health' => { rarity: 'rare', attunement: nil },
  'Figurine of Wondrous Power' => { rarity: 'rare', attunement: nil },
  'Gauntlets of Ogre Power' => { rarity: 'uncommon', attunement: 'requires attunement' },
  'Headband of Intellect' => { rarity: 'uncommon', attunement: 'requires attunement' },
  'Horseshoes of a Zephyr' => { rarity: 'very rare', attunement: nil },
  'Horseshoes of Speed' => { rarity: 'rare', attunement: nil },
  'Ioun Stone' => { rarity: 'rare', attunement: 'requires attunement' },
  'Iron Flask' => { rarity: 'legendary', attunement: nil },
  'Manual of Quickness of Action' => { rarity: 'very rare', attunement: nil },
  'Mirror of Life Trapping' => { rarity: 'very rare', attunement: nil },
  'Necklace of Adaptation' => { rarity: 'uncommon', attunement: 'requires attunement' },
  'Necklace of Fireballs' => { rarity: 'rare', attunement: nil },
  'Potion of Diminution' => { rarity: 'rare', attunement: nil },
  'Potions of Healing' => { rarity: 'common', attunement: nil },
  'Potion of Mind Reading' => { rarity: 'rare', attunement: nil },
  'Potion, Uncommon' => { rarity: 'uncommon', attunement: nil },
  'Ring, Legendary (Requires Attunement)' => { rarity: 'legendary', attunement: 'requires attunement' },
  'Robe of the Archmagi' => { rarity: 'legendary', attunement: 'requires attunement by a sorcerer, warlock, or wizard' },
  'Slippers of Spider Climbing' => { rarity: 'uncommon', attunement: 'requires attunement' },
  'Staff of Charming' => { rarity: 'rare', attunement: 'requires attunement by a bard, cleric, druid, sorcerer, warlock, or wizard' },
  'Staff of Frost' => { rarity: 'very rare', attunement: 'requires attunement by a druid, sorcerer, warlock, or wizard' },
  'Staff of the Woodlands' => { rarity: 'rare', attunement: 'requires attunement by a druid' },
  'Wand of Binding' => { rarity: 'rare', attunement: 'requires attunement by a spellcaster' },
  'Wand of Polymorph' => { rarity: 'very rare', attunement: 'requires attunement by a spellcaster' },
  'Wind Fan' => { rarity: 'uncommon', attunement: nil }
}.freeze

puts 'Updating 2024 Magic Items...'
updated = 0
not_found = 0

MAGIC_ITEMS_DATA.each do |name, data|
  item = Item.find_by(name: name, edition: '2024', type: 'MagicItem')
  if item
    item.update!(rarity: data[:rarity], requires_attunement: data[:attunement])
    puts "  Updated #{name}: rarity=#{data[:rarity]}, attunement=#{data[:attunement] || 'none'}"
    updated += 1
  else
    puts "  Not found: #{name}"
    not_found += 1
  end
end

puts "\nDone! Updated: #{updated}, Not found: #{not_found}"
