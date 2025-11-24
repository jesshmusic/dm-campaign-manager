# Comprehensive SRD data for test environment
# Auto-generated from development database

# 12 SRD D&D Classes
DndClass.create!([
  { name: 'Barbarian', slug: 'barbarian', hit_die: 12, user_id: nil },
  { name: 'Bard', slug: 'bard', hit_die: 8, user_id: nil },
  { name: 'Cleric', slug: 'cleric', hit_die: 8, user_id: nil },
  { name: 'Druid', slug: 'druid', hit_die: 8, user_id: nil },
  { name: 'Fighter', slug: 'fighter', hit_die: 10, user_id: nil },
  { name: 'Monk', slug: 'monk', hit_die: 8, user_id: nil },
  { name: 'Paladin', slug: 'paladin', hit_die: 10, user_id: nil },
  { name: 'Ranger', slug: 'ranger', hit_die: 10, user_id: nil },
  { name: 'Rogue', slug: 'rogue', hit_die: 8, user_id: nil },
  { name: 'Sorcerer', slug: 'sorcerer', hit_die: 6, user_id: nil },
  { name: 'Warlock', slug: 'warlock', hit_die: 8, user_id: nil },
  { name: 'Wizard', slug: 'wizard', hit_die: 6, user_id: nil },
])

# 9 SRD Monsters (includes 4 types: aberration, humanoid, dragon, undead)
Monster.create!([
  { name: 'Aboleth', slug: 'aboleth', armor_class: 17, hit_points: 135, hit_dice: '18d10', challenge_rating: '10', xp: 5900, strength: 21, dexterity: 9, constitution: 15, intelligence: 18, wisdom: 15, charisma: 18, size: 'Large', monster_type: 'aberration', alignment: 'lawful evil', attack_bonus: 9, prof_bonus: 4, save_dc: 16, user_id: nil },
  { name: 'Acolyte', slug: 'acolyte', armor_class: 10, hit_points: 9, hit_dice: '2d8', challenge_rating: '1/4', xp: 50, strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 14, charisma: 11, size: 'Medium', monster_type: 'humanoid', alignment: 'any alignment', attack_bonus: 2, prof_bonus: 2, save_dc: 12, user_id: nil },
  { name: 'Adult Black Dragon', slug: 'adult-black-dragon', armor_class: 19, hit_points: 195, hit_dice: '17d12', challenge_rating: '14', xp: 11500, strength: 23, dexterity: 14, constitution: 21, intelligence: 14, wisdom: 13, charisma: 17, size: 'Huge', monster_type: 'dragon', alignment: 'chaotic evil', attack_bonus: 11, prof_bonus: 5, save_dc: 19, user_id: nil },
  { name: 'Adult Blue Dragon', slug: 'adult-blue-dragon', armor_class: 19, hit_points: 225, hit_dice: '18d12', challenge_rating: '16', xp: 15000, strength: 25, dexterity: 10, constitution: 23, intelligence: 16, wisdom: 15, charisma: 19, size: 'Huge', monster_type: 'dragon', alignment: 'lawful evil', attack_bonus: 12, prof_bonus: 5, save_dc: 19, user_id: nil },
  { name: 'Adult Brass Dragon', slug: 'adult-brass-dragon', armor_class: 18, hit_points: 172, hit_dice: '15d12', challenge_rating: '13', xp: 10000, strength: 23, dexterity: 10, constitution: 21, intelligence: 14, wisdom: 13, charisma: 17, size: 'Huge', monster_type: 'dragon', alignment: 'chaotic good', attack_bonus: 11, prof_bonus: 5, save_dc: 18, user_id: nil },
  { name: 'Adult Bronze Dragon', slug: 'adult-bronze-dragon', armor_class: 19, hit_points: 212, hit_dice: '17d12', challenge_rating: '15', xp: 13000, strength: 25, dexterity: 10, constitution: 23, intelligence: 16, wisdom: 15, charisma: 19, size: 'Huge', monster_type: 'dragon', alignment: 'lawful good', attack_bonus: 12, prof_bonus: 5, save_dc: 19, user_id: nil },
  { name: 'Adult Copper Dragon', slug: 'adult-copper-dragon', armor_class: 18, hit_points: 184, hit_dice: '16d12', challenge_rating: '14', xp: 11500, strength: 23, dexterity: 12, constitution: 21, intelligence: 18, wisdom: 15, charisma: 17, size: 'Huge', monster_type: 'dragon', alignment: 'chaotic good', attack_bonus: 11, prof_bonus: 5, save_dc: 19, user_id: nil },
  { name: 'Orc', slug: 'orc', armor_class: 13, hit_points: 15, hit_dice: '2d8+6', challenge_rating: '1/2', xp: 100, strength: 16, dexterity: 12, constitution: 16, intelligence: 7, wisdom: 11, charisma: 10, size: 'Medium', monster_type: 'humanoid', alignment: 'chaotic evil', attack_bonus: 5, prof_bonus: 2, save_dc: 13, user_id: nil },
  { name: 'Skeleton', slug: 'skeleton', armor_class: 13, hit_points: 13, hit_dice: '2d8+4', challenge_rating: '1/4', xp: 50, strength: 10, dexterity: 14, constitution: 15, intelligence: 6, wisdom: 8, charisma: 5, size: 'Medium', monster_type: 'undead', alignment: 'lawful evil', attack_bonus: 4, prof_bonus: 2, save_dc: 12, user_id: nil },
])

# 6 SRD Races
Race.create!([
  { name: 'Dragonborn', slug: 'dragonborn', speed: 30, user_id: nil },
  { name: 'Dwarf', slug: 'dwarf', speed: 25, user_id: nil },
  { name: 'Elf', slug: 'elf', speed: 30, user_id: nil },
  { name: 'Gnome', slug: 'gnome', speed: 25, user_id: nil },
  { name: 'Half-Elf', slug: 'half-elf', speed: 30, user_id: nil },
  { name: 'Half-Orc', slug: 'half-orc', speed: 30, user_id: nil },
])

# 6 SRD Spells
Spell.create!([
  { name: 'Acid Arrow', slug: 'acid-arrow', level: 2, school: 'Evocation', casting_time: '1 action', range: '90 feet', duration: 'Instantaneous', user_id: nil },
  { name: 'Acid Splash', slug: 'acid-splash', level: 0, school: 'Conjuration', casting_time: '1 action', range: '60 feet', duration: 'Instantaneous', user_id: nil },
  { name: 'Aid', slug: 'aid', level: 2, school: 'Abjuration', casting_time: '1 action', range: '30 feet', duration: '8 hours', user_id: nil },
  { name: 'Alarm', slug: 'alarm', level: 1, school: 'Abjuration', casting_time: '1 minute', range: '30 feet', duration: '8 hours', user_id: nil },
  { name: 'Alter Self', slug: 'alter-self', level: 2, school: 'Transmutation', casting_time: '1 action', range: 'Self', duration: 'Up to 1 hour', user_id: nil },
  { name: 'Animal Friendship', slug: 'animal-friendship', level: 1, school: 'Enchantment', casting_time: '1 action', range: '30 feet', duration: '24 hours', user_id: nil },
])

# 20 SRD Items (using STI type column)
GearItem.create!([
  { name: 'Abacus', slug: 'abacus', user_id: nil },
  { name: 'Acid (vial)', slug: 'acid-vial', user_id: nil },
  { name: "Alchemist's fire (flask)", slug: 'alchemists-fire-flask', user_id: nil },
  { name: 'Alms box', slug: 'alms-box', user_id: nil },
  { name: 'Amulet', slug: 'amulet', user_id: nil },
  { name: 'Antitoxin (vial)', slug: 'antitoxin-vial', user_id: nil },
  { name: 'Arrow', slug: 'arrow', user_id: nil },
  { name: 'Backpack', slug: 'backpack', user_id: nil },
  { name: 'Ball bearings (bag of 1,000)', slug: 'ball-bearings-bag-of-1-000', user_id: nil },
])

ToolItem.create!([
  { name: "Alchemist's Supplies", slug: 'alchemists-supplies', user_id: nil },
  { name: 'Bagpipes', slug: 'bagpipes', user_id: nil },
])

VehicleItem.create!([
  { name: 'Animal Feed (1 day)', slug: 'animal-feed-1-day', user_id: nil },
  { name: 'Barding: Breastplate', slug: 'barding-breastplate', user_id: nil },
  { name: 'Barding: Chain mail', slug: 'barding-chain-mail', user_id: nil },
  { name: 'Barding: Chain shirt', slug: 'barding-chain-shirt', user_id: nil },
  { name: 'Barding: Half plate', slug: 'barding-half-plate', user_id: nil },
  { name: 'Barding: Hide', slug: 'barding-hide', user_id: nil },
  { name: 'Barding: Leather', slug: 'barding-leather', user_id: nil },
  { name: 'Barding: Padded', slug: 'barding-padded', user_id: nil },
  { name: 'Barding: Plate', slug: 'barding-plate', user_id: nil },
])
