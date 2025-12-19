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
MAGIC_ARMOR_DATA.each do |name, data|
  item = Item.find_by(name: name, edition: '2024', type: 'MagicArmorItem')
  if item
    item.update!(rarity: data[:rarity], requires_attunement: data[:attunement])
    puts "  Updated #{name}: rarity=#{data[:rarity]}, attunement=#{data[:attunement] || 'none'}"
  else
    puts "  Not found: #{name}"
  end
end

puts "\nUpdating 2024 Magic Weapon Items..."
MAGIC_WEAPON_DATA.each do |name, data|
  item = Item.find_by(name: name, edition: '2024', type: 'MagicWeaponItem')
  if item
    item.update!(rarity: data[:rarity], requires_attunement: data[:attunement])
    puts "  Updated #{name}: rarity=#{data[:rarity]}, attunement=#{data[:attunement] || 'none'}"
  else
    puts "  Not found: #{name}"
  end
end

puts "\nDone!"
