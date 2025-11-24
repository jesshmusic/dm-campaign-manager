# Minimal SRD data for test environment
# This file creates only the minimal set of SRD data needed for tests to pass

# 4 SRD Monsters (user_id IS NULL)
Monster.create!([
  { name: 'Orc', slug: 'orc', armor_class: 13, hit_points: 15, hit_dice: '2d8+6',
    challenge_rating: '1/2', xp: 100, strength: 16, dexterity: 12, constitution: 16, intelligence: 7, wisdom: 11, charisma: 10,
    size: 'Medium', monster_type: 'humanoid', alignment: 'chaotic evil', user_id: nil },
  { name: 'Goblin', slug: 'goblin', armor_class: 15, hit_points: 7, hit_dice: '2d6',
    challenge_rating: '1/4', xp: 50, strength: 8, dexterity: 14, constitution: 10, intelligence: 10, wisdom: 8, charisma: 8,
    size: 'Small', monster_type: 'humanoid', alignment: 'neutral evil', user_id: nil },
  { name: 'Skeleton', slug: 'skeleton', armor_class: 13, hit_points: 13, hit_dice: '2d8+4',
    challenge_rating: '1/4', xp: 50, strength: 10, dexterity: 14, constitution: 15, intelligence: 6, wisdom: 8, charisma: 5,
    size: 'Medium', monster_type: 'undead', alignment: 'lawful evil', user_id: nil },
  { name: 'Wolf', slug: 'wolf', armor_class: 13, hit_points: 11, hit_dice: '2d8+2',
    challenge_rating: '1/4', xp: 50, strength: 12, dexterity: 15, constitution: 12, intelligence: 3, wisdom: 12, charisma: 6,
    size: 'Medium', monster_type: 'beast', alignment: 'unaligned', user_id: nil }
])

# 3 SRD Spells
Spell.create!([
  { name: 'Fireball', slug: 'fireball', description: 'A bright streak flashes from your pointing finger to a point you choose within range and then blossoms with a low roar into an explosion of flame.',
    level: 3, casting_time: '1 action', range: '150 feet', components: ['V', 'S', 'M'],
    duration: 'Instantaneous', school: 'Evocation', user_id: nil },
  { name: 'Magic Missile', slug: 'magic-missile', description: 'You create three glowing darts of magical force. Each dart hits a creature of your choice that you can see within range.',
    level: 1, casting_time: '1 action', range: '120 feet', components: ['V', 'S'],
    duration: 'Instantaneous', school: 'Evocation', user_id: nil },
  { name: 'Cure Wounds', slug: 'cure-wounds', description: 'A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.',
    level: 1, casting_time: '1 action', range: 'Touch', components: ['V', 'S'],
    duration: 'Instantaneous', school: 'Evocation', user_id: nil }
])

# 3 SRD Races
Race.create!([
  { name: 'Human', slug: 'human', speed: 30, size: 'Medium',
    alignment: 'Humans tend toward no particular alignment.',
    age: 'Humans reach adulthood in their late teens and live less than a century.',
    language_description: 'You can speak, read, and write Common and one extra language of your choice.', user_id: nil },
  { name: 'Elf', slug: 'elf', speed: 30, size: 'Medium',
    alignment: 'Elves love freedom, variety, and self-expression.',
    age: 'Although elves reach physical maturity at about the same age as humans, elves can live to be 750 years old.',
    language_description: 'You can speak, read, and write Common and Elvish.', user_id: nil },
  { name: 'Dwarf', slug: 'dwarf', speed: 25, size: 'Medium',
    alignment: 'Most dwarves are lawful, believing firmly in the benefits of a well-ordered society.',
    age: 'Dwarves mature at the same rate as humans, but they are considered young until they reach the age of 50.',
    language_description: 'You can speak, read, and write Common and Dwarvish.', user_id: nil }
])

puts "Minimal SRD data created: #{Monster.count} monsters, #{Spell.count} spells, #{Race.count} races"
