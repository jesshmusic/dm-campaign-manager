# frozen_string_literal: true

# Script to update 2024 items with complete data from the SRD 5.2.1 equipment tables
# Run with: rails runner scripts/update_2024_items.rb

# Weapon data from SRD 5.2.1 - Format: Name => [damage, properties, mastery, weight, cost_quantity, cost_unit]
SIMPLE_MELEE_WEAPONS = {
  'Club' => ['1d4 Bludgeoning', ['Light'], 'Slow', 2, 1, 'sp'],
  'Dagger' => ['1d4 Piercing', ['Finesse', 'Light', 'Thrown'], 'Nick', 1, 2, 'gp'],
  'Greatclub' => ['1d8 Bludgeoning', ['Two-Handed'], 'Push', 10, 2, 'sp'],
  'Handaxe' => ['1d6 Slashing', ['Light', 'Thrown'], 'Vex', 2, 5, 'gp'],
  'Javelin' => ['1d6 Piercing', ['Thrown'], 'Slow', 2, 5, 'sp'],
  'Light Hammer' => ['1d4 Bludgeoning', ['Light', 'Thrown'], 'Nick', 2, 2, 'gp'],
  'Mace' => ['1d6 Bludgeoning', [], 'Sap', 4, 5, 'gp'],
  'Quarterstaff' => ['1d6 Bludgeoning', ['Versatile'], 'Topple', 4, 2, 'sp'],
  'Sickle' => ['1d4 Slashing', ['Light'], 'Nick', 2, 1, 'gp'],
  'Spear' => ['1d6 Piercing', ['Thrown', 'Versatile'], 'Sap', 3, 1, 'gp']
}.freeze

SIMPLE_RANGED_WEAPONS = {
  'Dart' => ['1d4 Piercing', ['Finesse', 'Thrown'], 'Vex', 0.25, 5, 'cp'],
  'Light Crossbow' => ['1d8 Piercing', ['Ammunition', 'Loading', 'Two-Handed'], 'Slow', 5, 25, 'gp'],
  'Shortbow' => ['1d6 Piercing', ['Ammunition', 'Two-Handed'], 'Vex', 2, 25, 'gp'],
  'Sling' => ['1d4 Bludgeoning', ['Ammunition'], 'Slow', 0, 1, 'sp']
}.freeze

MARTIAL_MELEE_WEAPONS = {
  'Battleaxe' => ['1d8 Slashing', ['Versatile'], 'Topple', 4, 10, 'gp'],
  'Flail' => ['1d8 Bludgeoning', [], 'Sap', 2, 10, 'gp'],
  'Glaive' => ['1d10 Slashing', ['Heavy', 'Reach', 'Two-Handed'], 'Graze', 6, 20, 'gp'],
  'Greataxe' => ['1d12 Slashing', ['Heavy', 'Two-Handed'], 'Cleave', 7, 30, 'gp'],
  'Greatsword' => ['2d6 Slashing', ['Heavy', 'Two-Handed'], 'Graze', 6, 50, 'gp'],
  'Halberd' => ['1d10 Slashing', ['Heavy', 'Reach', 'Two-Handed'], 'Cleave', 6, 20, 'gp'],
  'Lance' => ['1d10 Piercing', ['Heavy', 'Reach', 'Two-Handed'], 'Topple', 6, 10, 'gp'],
  'Longsword' => ['1d8 Slashing', ['Versatile'], 'Sap', 3, 15, 'gp'],
  'Maul' => ['2d6 Bludgeoning', ['Heavy', 'Two-Handed'], 'Topple', 10, 10, 'gp'],
  'Morningstar' => ['1d8 Piercing', [], 'Sap', 4, 15, 'gp'],
  'Pike' => ['1d10 Piercing', ['Heavy', 'Reach', 'Two-Handed'], 'Push', 18, 5, 'gp'],
  'Rapier' => ['1d8 Piercing', ['Finesse'], 'Vex', 2, 25, 'gp'],
  'Scimitar' => ['1d6 Slashing', ['Finesse', 'Light'], 'Nick', 3, 25, 'gp'],
  'Shortsword' => ['1d6 Piercing', ['Finesse', 'Light'], 'Vex', 2, 10, 'gp'],
  'Trident' => ['1d8 Piercing', ['Thrown', 'Versatile'], 'Topple', 4, 5, 'gp'],
  'Warhammer' => ['1d8 Bludgeoning', ['Versatile'], 'Push', 5, 15, 'gp'],
  'War Pick' => ['1d8 Piercing', ['Versatile'], 'Sap', 2, 5, 'gp'],
  'Whip' => ['1d4 Slashing', ['Finesse', 'Reach'], 'Slow', 3, 2, 'gp']
}.freeze

MARTIAL_RANGED_WEAPONS = {
  'Blowgun' => ['1 Piercing', ['Ammunition', 'Loading'], 'Vex', 1, 10, 'gp'],
  'Crossbow, hand' => ['1d6 Piercing', ['Ammunition', 'Light', 'Loading'], 'Vex', 3, 75, 'gp'],
  'Hand Crossbow' => ['1d6 Piercing', ['Ammunition', 'Light', 'Loading'], 'Vex', 3, 75, 'gp'],
  'Crossbow, heavy' => ['1d10 Piercing', ['Ammunition', 'Heavy', 'Loading', 'Two-Handed'], 'Push', 18, 50, 'gp'],
  'Heavy Crossbow' => ['1d10 Piercing', ['Ammunition', 'Heavy', 'Loading', 'Two-Handed'], 'Push', 18, 50, 'gp'],
  'Crossbow, light' => ['1d8 Piercing', ['Ammunition', 'Loading', 'Two-Handed'], 'Slow', 5, 25, 'gp'],
  'Longbow' => ['1d8 Piercing', ['Ammunition', 'Heavy', 'Two-Handed'], 'Slow', 2, 50, 'gp'],
  'Musket' => ['1d12 Piercing', ['Ammunition', 'Loading', 'Two-Handed'], 'Slow', 10, 500, 'gp'],
  'Pistol' => ['1d10 Piercing', ['Ammunition', 'Loading'], 'Vex', 3, 250, 'gp'],
  'Net' => ['0', ['Thrown'], 'Slow', 3, 1, 'gp']
}.freeze

ALL_WEAPONS = SIMPLE_MELEE_WEAPONS.merge(SIMPLE_RANGED_WEAPONS)
                                  .merge(MARTIAL_MELEE_WEAPONS)
                                  .merge(MARTIAL_RANGED_WEAPONS)

# Armor data from SRD 5.2.1 - Format: Name => [ac_base, has_dex_bonus, max_dex_bonus, stealth_disadvantage, str_minimum, armor_category, weight, cost_quantity, cost_unit]
# Adventuring Gear costs from SRD 5.2.1 - Format: Name => [weight, cost_quantity, cost_unit]
GEAR_DATA = {
  'Acid' => [1, 25, 'gp'],
  "Alchemist's Fire" => [1, 50, 'gp'],
  'Antitoxin' => [0, 50, 'gp'],
  'Backpack' => [5, 2, 'gp'],
  'Ball Bearings' => [2, 1, 'gp'],
  'Barrel' => [70, 2, 'gp'],
  'Basket' => [2, 4, 'sp'],
  'Bedroll' => [7, 1, 'gp'],
  'Bell' => [0, 1, 'gp'],
  'Blanket' => [3, 5, 'sp'],
  'Block and Tackle' => [5, 1, 'gp'],
  'Book' => [5, 25, 'gp'],
  'Bottle, Glass' => [2, 2, 'gp'],
  'Glass Bottle' => [2, 2, 'gp'],
  'Bucket' => [2, 5, 'cp'],
  "Burglar's Pack" => [42, 16, 'gp'],
  'Caltrops' => [2, 1, 'gp'],
  'Candle' => [0, 1, 'cp'],
  'Case, Crossbow Bolt' => [1, 1, 'gp'],
  'Crossbow Bolt Case' => [1, 1, 'gp'],
  'Case, Map or Scroll' => [1, 1, 'gp'],
  'Map or Scroll Case' => [1, 1, 'gp'],
  'Chain' => [10, 5, 'gp'],
  'Chest' => [25, 5, 'gp'],
  "Climber's Kit" => [12, 25, 'gp'],
  'Clothes, Fine' => [6, 15, 'gp'],
  'Fine Clothes' => [6, 15, 'gp'],
  "Clothes, Traveler's" => [4, 2, 'gp'],
  "Traveler's Clothes" => [4, 2, 'gp'],
  'Component Pouch' => [2, 25, 'gp'],
  'Costume' => [4, 5, 'gp'],
  'Crowbar' => [5, 2, 'gp'],
  "Diplomat's Pack" => [39, 39, 'gp'],
  "Dungeoneer's Pack" => [55, 12, 'gp'],
  "Entertainer's Pack" => [58, 40, 'gp'],
  "Explorer's Pack" => [55, 10, 'gp'],
  'Flask' => [1, 2, 'cp'],
  'Grappling Hook' => [4, 2, 'gp'],
  "Healer's Kit" => [3, 5, 'gp'],
  'Holy Water' => [1, 25, 'gp'],
  'Hunting Trap' => [25, 5, 'gp'],
  'Ink' => [0, 10, 'gp'],
  'Ink Pen' => [0, 2, 'cp'],
  'Jug' => [4, 2, 'cp'],
  'Ladder' => [25, 1, 'sp'],
  'Lamp' => [1, 5, 'sp'],
  'Lantern, Bullseye' => [2, 10, 'gp'],
  'Bullseye Lantern' => [2, 10, 'gp'],
  'Lantern, Hooded' => [2, 5, 'gp'],
  'Hooded Lantern' => [2, 5, 'gp'],
  'Lock' => [1, 10, 'gp'],
  'Magnifying Glass' => [0, 100, 'gp'],
  'Manacles' => [6, 2, 'gp'],
  'Map' => [0, 1, 'gp'],
  'Mirror' => [0.5, 5, 'gp'],
  'Net' => [3, 1, 'gp'],
  'Oil' => [1, 1, 'sp'],
  'Paper' => [0, 2, 'sp'],
  'Parchment' => [0, 1, 'sp'],
  'Perfume' => [0, 5, 'gp'],
  'Poison, Basic' => [0, 100, 'gp'],
  'Basic Poison' => [0, 100, 'gp'],
  'Pole' => [7, 5, 'cp'],
  'Pot, Iron' => [10, 2, 'gp'],
  'Iron Pot' => [10, 2, 'gp'],
  'Potion of Healing' => [0.5, 50, 'gp'],
  'Pouch' => [1, 5, 'sp'],
  "Priest's Pack" => [29, 33, 'gp'],
  'Quiver' => [1, 1, 'gp'],
  'Ram, Portable' => [35, 4, 'gp'],
  'Portable Ram' => [35, 4, 'gp'],
  'Rations' => [2, 5, 'sp'],
  'Robe' => [4, 1, 'gp'],
  'Rope' => [5, 1, 'gp'],
  'Rope, Hempen' => [10, 1, 'gp'],
  'Rope, Silk' => [5, 10, 'gp'],
  'Hempen Rope' => [10, 1, 'gp'],
  'Silk Rope' => [5, 10, 'gp'],
  'Sack' => [0.5, 1, 'cp'],
  "Scholar's Pack" => [22, 40, 'gp'],
  'Shovel' => [5, 2, 'gp'],
  'Signal Whistle' => [0, 5, 'cp'],
  'Spell Scroll (Cantrip)' => [0, 30, 'gp'],
  'Spell Scroll (Level 1)' => [0, 50, 'gp'],
  'Spikes, Iron' => [5, 1, 'gp'],
  'Iron Spikes' => [5, 1, 'gp'],
  'Spyglass' => [1, 1000, 'gp'],
  'String' => [0, 1, 'sp'],
  'Tent' => [20, 2, 'gp'],
  'Tinderbox' => [1, 5, 'sp'],
  'Torch' => [1, 1, 'cp'],
  'Vial' => [0, 1, 'gp'],
  'Waterskin' => [5, 2, 'sp'],
  # Arcane Focuses
  'Crystal' => [1, 10, 'gp'],
  'Orb' => [3, 20, 'gp'],
  'Rod' => [2, 10, 'gp'],
  'Staff' => [4, 5, 'gp'],
  'Wand' => [1, 10, 'gp'],
  # Druidic Focuses
  'Sprig of Mistletoe' => [0, 1, 'gp'],
  'Wooden Staff' => [4, 5, 'gp'],
  'Yew Wand' => [1, 10, 'gp'],
  # Holy Symbols
  'Amulet' => [1, 5, 'gp'],
  'Emblem' => [0, 5, 'gp'],
  'Reliquary' => [2, 5, 'gp'],
  # Ammunition
  'Arrows' => [1, 1, 'gp'],
  'Bolts' => [1.5, 1, 'gp'],
  'Bullets, Firearm' => [2, 3, 'gp'],
  'Bullets, Sling' => [1.5, 4, 'cp'],
  'Sling Bullets' => [1.5, 4, 'cp'],
  'Needles' => [1, 1, 'gp']
}.freeze

# Tools from SRD 5.2.1 - Format: Name => [weight, cost_quantity, cost_unit]
TOOL_DATA = {
  "Alchemist's Supplies" => [8, 50, 'gp'],
  "Brewer's Supplies" => [9, 20, 'gp'],
  "Calligrapher's Supplies" => [5, 10, 'gp'],
  "Carpenter's Tools" => [6, 8, 'gp'],
  "Cartographer's Tools" => [6, 15, 'gp'],
  "Cobbler's Tools" => [5, 5, 'gp'],
  "Cook's Utensils" => [8, 1, 'gp'],
  "Glassblower's Tools" => [5, 30, 'gp'],
  "Jeweler's Tools" => [2, 25, 'gp'],
  "Leatherworker's Tools" => [5, 5, 'gp'],
  "Mason's Tools" => [8, 10, 'gp'],
  "Painter's Supplies" => [5, 10, 'gp'],
  "Potter's Tools" => [3, 10, 'gp'],
  "Smith's Tools" => [8, 20, 'gp'],
  "Tinker's Tools" => [10, 50, 'gp'],
  "Weaver's Tools" => [5, 1, 'gp'],
  "Woodcarver's Tools" => [5, 1, 'gp'],
  'Disguise Kit' => [3, 25, 'gp'],
  'Forgery Kit' => [5, 15, 'gp'],
  'Dice Set' => [0, 1, 'sp'],
  'Dragonchess Set' => [0, 1, 'gp'],
  'Playing Card Set' => [0, 5, 'sp'],
  'Three-Dragon Ante Set' => [0, 1, 'gp'],
  'Herbalism Kit' => [3, 5, 'gp'],
  'Bagpipes' => [6, 30, 'gp'],
  'Drum' => [3, 6, 'gp'],
  'Dulcimer' => [10, 25, 'gp'],
  'Flute' => [1, 2, 'gp'],
  'Horn' => [2, 3, 'gp'],
  'Lute' => [2, 35, 'gp'],
  'Lyre' => [2, 30, 'gp'],
  'Pan Flute' => [2, 12, 'gp'],
  'Shawm' => [1, 2, 'gp'],
  'Viol' => [1, 30, 'gp'],
  "Navigator's Tools" => [2, 25, 'gp'],
  "Poisoner's Kit" => [2, 50, 'gp'],
  "Thieves' Tools" => [1, 25, 'gp']
}.freeze

# Mounts and Vehicles from SRD 5.2.1 - Format: Name => [speed, capacity, weight, cost_quantity, cost_unit]
VEHICLE_DATA = {
  'Camel' => ['50 ft.', '480 lb.', 0, 50, 'gp'],
  'Donkey' => ['40 ft.', '420 lb.', 0, 8, 'gp'],
  'Mule' => ['40 ft.', '420 lb.', 0, 8, 'gp'],
  'Elephant' => ['40 ft.', '1,320 lb.', 0, 200, 'gp'],
  'Draft Horse' => ['40 ft.', '540 lb.', 0, 50, 'gp'],
  'Riding Horse' => ['60 ft.', '480 lb.', 0, 75, 'gp'],
  'Mastiff' => ['40 ft.', '195 lb.', 0, 25, 'gp'],
  'Pony' => ['40 ft.', '225 lb.', 0, 30, 'gp'],
  'Warhorse' => ['60 ft.', '540 lb.', 0, 400, 'gp'],
  'Barding' => [nil, nil, 0, 0, 'gp'], # Cost varies by armor type
  'Bit and Bridle' => [nil, nil, 1, 2, 'gp'],
  'Carriage' => [nil, nil, 600, 100, 'gp'],
  'Cart' => [nil, nil, 200, 15, 'gp'],
  'Chariot' => [nil, nil, 100, 250, 'gp'],
  'Feed (per day)' => [nil, nil, 10, 5, 'cp'],
  'Saddle, Exotic' => [nil, nil, 40, 60, 'gp'],
  'Exotic Saddle' => [nil, nil, 40, 60, 'gp'],
  'Saddle, Military' => [nil, nil, 30, 20, 'gp'],
  'Military Saddle' => [nil, nil, 30, 20, 'gp'],
  'Saddle, Pack' => [nil, nil, 15, 5, 'gp'],
  'Pack Saddle' => [nil, nil, 15, 5, 'gp'],
  'Saddle, Riding' => [nil, nil, 25, 10, 'gp'],
  'Riding Saddle' => [nil, nil, 25, 10, 'gp'],
  'Saddlebags' => [nil, nil, 8, 4, 'gp'],
  'Sled' => [nil, nil, 300, 20, 'gp'],
  'Stabling (per day)' => [nil, nil, 0, 5, 'sp'],
  'Wagon' => [nil, nil, 400, 35, 'gp'],
  'Galley' => [nil, nil, 0, 30000, 'gp'],
  'Keelboat' => [nil, nil, 0, 3000, 'gp'],
  'Longship' => [nil, nil, 0, 10000, 'gp'],
  'Rowboat' => [nil, nil, 100, 50, 'gp'],
  'Sailing Ship' => [nil, nil, 0, 10000, 'gp'],
  'Warship' => [nil, nil, 0, 25000, 'gp']
}.freeze

# Armor data from SRD 5.2.1 - Format: Name => [ac_base, has_dex_bonus, max_dex_bonus, stealth_disadvantage, str_minimum, armor_category, weight, cost_quantity, cost_unit]
ARMOR_DATA = {
  # Light Armor
  'Padded Armor' => [11, true, nil, true, nil, 'Light', 8, 5, 'gp'],
  'Leather Armor' => [11, true, nil, false, nil, 'Light', 10, 10, 'gp'],
  'Studded Leather Armor' => [12, true, nil, false, nil, 'Light', 13, 45, 'gp'],
  'Studded Leather' => [12, true, nil, false, nil, 'Light', 13, 45, 'gp'],
  # Medium Armor
  'Hide Armor' => [12, true, 2, false, nil, 'Medium', 12, 10, 'gp'],
  'Hide' => [12, true, 2, false, nil, 'Medium', 12, 10, 'gp'],
  'Chain Shirt' => [13, true, 2, false, nil, 'Medium', 20, 50, 'gp'],
  'Scale Mail' => [14, true, 2, true, nil, 'Medium', 45, 50, 'gp'],
  'Breastplate' => [14, true, 2, false, nil, 'Medium', 20, 400, 'gp'],
  'Half Plate Armor' => [15, true, 2, true, nil, 'Medium', 40, 750, 'gp'],
  'Half Plate' => [15, true, 2, true, nil, 'Medium', 40, 750, 'gp'],
  # Heavy Armor
  'Ring Mail' => [14, false, nil, true, nil, 'Heavy', 40, 30, 'gp'],
  'Chain Mail' => [16, false, nil, true, 13, 'Heavy', 55, 75, 'gp'],
  'Splint Armor' => [17, false, nil, true, 15, 'Heavy', 60, 200, 'gp'],
  'Splint' => [17, false, nil, true, 15, 'Heavy', 60, 200, 'gp'],
  'Plate Armor' => [18, false, nil, true, 15, 'Heavy', 65, 1500, 'gp'],
  'Plate' => [18, false, nil, true, 15, 'Heavy', 65, 1500, 'gp'],
  # Shield
  'Shield' => [2, false, nil, false, nil, 'Shield', 6, 10, 'gp']
}.freeze

def update_weapon(weapon, data)
  damage_str, properties, mastery, weight, cost_qty, cost_unit = data

  # Parse damage
  if damage_str && damage_str != '0'
    match = damage_str.match(/^(\d+)?d?(\d+)?\s*(.+)?$/)
    if match
      dice = match[1] ? "#{match[1]}d#{match[2]}" : (match[2] ? "1d#{match[2]}" : '1')
      damage_type = match[3]&.strip&.downcase || 'piercing'

      weapon.damage&.destroy
      weapon.create_damage(damage_dice: dice, damage_type: damage_type)
    end
  end

  # Update properties
  weapon.properties = properties if properties

  # Update mastery
  weapon.mastery = mastery

  # Update weight
  weapon.weight = (weight * 1).to_i if weight # Convert to integer lb

  # Update cost
  weapon.cost&.destroy
  weapon.create_cost(quantity: cost_qty, unit: cost_unit) if cost_qty && cost_unit

  weapon.save!
  puts "  Updated weapon: #{weapon.name}"
end

def update_armor(armor, data)
  ac_base, has_dex, max_dex, stealth_dis, str_min, armor_cat, weight, cost_qty, cost_unit = data

  # Update armor class
  armor.armor_class&.destroy
  armor.create_armor_class(
    ac_base: ac_base,
    has_dex_bonus: has_dex,
    max_dex_bonus: max_dex
  )

  # Update armor category
  armor.armor_category = armor_cat

  # Update stealth disadvantage
  armor.stealth_disadvantage = stealth_dis

  # Update strength minimum
  armor.str_minimum = str_min

  # Update weight
  armor.weight = weight

  # Update cost
  armor.cost&.destroy
  armor.create_cost(quantity: cost_qty, unit: cost_unit) if cost_qty && cost_unit

  armor.save!
  puts "  Updated armor: #{armor.name}"
end

def update_gear(item, data)
  weight, cost_qty, cost_unit = data

  # Update weight
  item.weight = weight.to_i if weight

  # Update cost
  item.cost&.destroy
  item.create_cost(quantity: cost_qty, unit: cost_unit) if cost_qty && cost_unit

  item.save!
  puts "  Updated gear: #{item.name}"
end

def update_tool(item, data)
  weight, cost_qty, cost_unit = data

  # Update weight
  item.weight = weight.to_i if weight

  # Update cost
  item.cost&.destroy
  item.create_cost(quantity: cost_qty, unit: cost_unit) if cost_qty && cost_unit

  item.save!
  puts "  Updated tool: #{item.name}"
end

def update_vehicle(item, data)
  speed, capacity, weight, cost_qty, cost_unit = data

  # Update speed and capacity
  item.speed = speed if speed
  item.capacity = capacity if capacity

  # Update weight
  item.weight = weight.to_i if weight

  # Update cost
  item.cost&.destroy
  item.create_cost(quantity: cost_qty, unit: cost_unit) if cost_qty && cost_unit && cost_qty > 0

  item.save!
  puts "  Updated vehicle: #{item.name}"
end

puts 'Updating 2024 weapons...'
WeaponItem.for_edition('2024').find_each do |weapon|
  data = ALL_WEAPONS[weapon.name]
  if data
    update_weapon(weapon, data)
  else
    puts "  No data for weapon: #{weapon.name}"
  end
end

puts "\nUpdating 2024 armor..."
ArmorItem.for_edition('2024').find_each do |armor|
  data = ARMOR_DATA[armor.name]
  if data
    update_armor(armor, data)
  else
    puts "  No data for armor: #{armor.name}"
  end
end

puts "\nUpdating 2024 gear..."
GearItem.for_edition('2024').find_each do |gear|
  data = GEAR_DATA[gear.name]
  if data
    update_gear(gear, data)
  else
    puts "  No data for gear: #{gear.name}"
  end
end

puts "\nUpdating 2024 tools..."
ToolItem.for_edition('2024').find_each do |tool|
  data = TOOL_DATA[tool.name]
  if data
    update_tool(tool, data)
  else
    puts "  No data for tool: #{tool.name}"
  end
end

puts "\nUpdating 2024 vehicles..."
VehicleItem.for_edition('2024').find_each do |vehicle|
  data = VEHICLE_DATA[vehicle.name]
  if data
    update_vehicle(vehicle, data)
  else
    puts "  No data for vehicle: #{vehicle.name}"
  end
end

puts "\nDone!"
