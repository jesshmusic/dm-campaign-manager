# frozen_string_literal: true

# Script to update 2024 magic items with rarity and attunement data from SRD 5.2.1

# Magic Armor Items 2024 data from SRD 5.2.1
MAGIC_ARMOR_DATA = {
  'Animated Shield' => { rarity: 'very rare', attunement: 'requires attunement' },
  'Armor, +1, +2, or +3' => { rarity: 'rare', attunement: nil },
  'Armor of Vulnerability' => { rarity: 'rare', attunement: 'requires attunement' },
  'Elven Chain' => { rarity: 'rare', attunement: nil },
  'Mithral Armor' => { rarity: 'uncommon', attunement: nil },
  'Shield, +1, +2, or +3' => { rarity: 'uncommon', attunement: nil }
}.freeze

# Magic Weapon Items 2024 data from SRD 5.2.1
MAGIC_WEAPON_DATA = {
  'Berserker Axe' => { rarity: 'rare', attunement: 'requires attunement' },
  'Dancing Sword' => { rarity: 'very rare', attunement: 'requires attunement' },
  'Defender' => { rarity: 'legendary', attunement: 'requires attunement' },
  'Dragon Slayer' => { rarity: 'rare', attunement: nil },
  'Flame Tongue' => { rarity: 'rare', attunement: 'requires attunement' },
  'Nine Lives Stealer' => { rarity: 'very rare', attunement: 'requires attunement' },
  'Oathbow' => { rarity: 'very rare', attunement: 'requires attunement' },
  'Thunderous Greatclub' => { rarity: 'very rare', attunement: nil },
  'Weapon, +1, +2, or +3' => { rarity: 'uncommon', attunement: nil }
}.freeze

puts 'Updating 2024 Magic Armor Items...'
# Pre-fetch all magic armor items to avoid N+1 queries
magic_armor_items = Item.where(edition: '2024', type: 'MagicArmorItem')
                        .where(name: MAGIC_ARMOR_DATA.keys)
                        .index_by(&:name)

MAGIC_ARMOR_DATA.each do |name, data|
  item = magic_armor_items[name]
  if item
    item.update!(rarity: data[:rarity], requires_attunement: data[:attunement])
    puts "  Updated #{name}: rarity=#{data[:rarity]}, attunement=#{data[:attunement] || 'none'}"
  else
    puts "  Not found: #{name}"
  end
end

puts "\nUpdating 2024 Magic Weapon Items..."
# Pre-fetch all magic weapon items to avoid N+1 queries
magic_weapon_items = Item.where(edition: '2024', type: 'MagicWeaponItem')
                         .where(name: MAGIC_WEAPON_DATA.keys)
                         .index_by(&:name)

MAGIC_WEAPON_DATA.each do |name, data|
  item = magic_weapon_items[name]
  if item
    item.update!(rarity: data[:rarity], requires_attunement: data[:attunement])
    puts "  Updated #{name}: rarity=#{data[:rarity]}, attunement=#{data[:attunement] || 'none'}"
  else
    puts "  Not found: #{name}"
  end
end

puts "\nDone!"
