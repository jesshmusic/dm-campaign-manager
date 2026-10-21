# frozen_string_literal: true

# A DM Guru monster as the data for a dnd5e 6 NPC actor (Foundry 14), for
# Dorman Lakely's Campaign Planner to pass to Actor.create: its abilities, AC,
# HP, speeds, senses, CR, type, traits and legendary actions, its actions and
# traits as items (Monster#foundry_items), and a prototype token sized for it.
# Traits dnd5e doesn't have a key for (a language, "nonmagical attacks") go in
# their custom text.
class MonsterFoundryActor
  # dnd5e's own NPC artwork
  IMG = 'systems/dnd5e/icons/svg/actors/npc.svg'
  SPEEDS = %w[walk burrow climb fly swim].freeze
  SENSES = %w[blindsight darkvision tremorsense truesight].freeze
  CREATURE_TYPES = %w[aberration beast celestial construct dragon elemental fey fiend giant humanoid monstrosity ooze plant
                      undead].freeze
  DAMAGE_TYPES = %w[acid bludgeoning cold fire force lightning necrotic piercing poison psychic radiant slashing thunder].freeze
  CONDITIONS = %w[blinded charmed deafened diseased exhaustion frightened grappled incapacitated invisible paralyzed
                  petrified poisoned prone restrained stunned unconscious].freeze
  # dnd5e's language keys, by the name a stat block uses
  LANGUAGES = %w[common draconic dwarvish elvish giant gnomish goblin halfling orc aarakocra abyssal celestial druidic
                 gith gnoll infernal primordial sylvan undercommon aquan auran ignan terran]
              .index_with(&:itself)
              .merge('deep speech' => 'deep', "thieves' cant" => 'cant', 'thieves’ cant' => 'cant',
                     'sign language' => 'sign', 'common sign language' => 'sign')
              .freeze
  SIZES = { 'tiny' => 'tiny', 'small' => 'sm', 'medium' => 'med', 'large' => 'lg', 'huge' => 'huge',
            'gargantuan' => 'grg' }.freeze
  # Grid squares a token of each size covers
  TOKEN_SIZES = { 'tiny' => 0.5, 'sm' => 1, 'med' => 1, 'lg' => 2, 'huge' => 3, 'grg' => 4 }.freeze
  SWARM = /\Aswarm of (tiny|small|medium|large|huge) (\w+)\z/i

  def initialize(monster)
    @monster = monster
  end

  def to_h
    {
      name: @monster.name,
      type: 'npc',
      img: IMG,
      system: {
        abilities: abilities,
        attributes: attributes,
        details: details,
        traits: traits,
        resources: resources,
        source: { book: 'Dungeon Master Guru', page: '', custom: '', rules: @monster.edition == '2024' ? '2024' : '2014' }
      },
      items: @monster.foundry_items,
      prototypeToken: prototype_token
    }
  end

  private

  def abilities
    { str: @monster.strength, dex: @monster.dexterity, con: @monster.constitution, int: @monster.intelligence,
      wis: @monster.wisdom, cha: @monster.charisma }.transform_values { |score| { value: score } }
  end

  # A stat block's AC is its natural armor; the HP formula is its hit dice
  def attributes
    {
      ac: { flat: @monster.armor_class, calcs: ['natural'] },
      hp: { value: @monster.hit_points, max: @monster.hit_points, formula: @monster.hit_dice.to_s },
      movement: movement,
      senses: senses
    }
  end

  def movement
    speeds = @monster.speeds.each_with_object({}) do |speed, found|
      key = speed.name.to_s.downcase.strip
      found[key] = speed.value.to_i.to_s if SPEEDS.include?(key) && speed.value.to_i.positive?
    end
    speeds['walk'] ||= '30' unless speeds.any?
    hover = @monster.speeds.any? { |speed| speed.name.to_s.downcase.strip == 'hover' }
    { speeds: speeds, units: 'ft', hover: hover }
  end

  def senses
    ranges = @monster.senses.each_with_object({}) do |sense, found|
      key = sense.name.to_s.downcase.delete(' ')
      found[key] = sense.value.to_i if SENSES.include?(key) && sense.value.to_i.positive?
    end
    { ranges: ranges, units: 'ft', special: '' }
  end

  def details
    {
      cr: @monster.challenge_rating.present? ? CrCalc.cr_string_to_num(@monster.challenge_rating) : nil,
      alignment: @monster.alignment.to_s,
      type: creature_type,
      biography: { value: @monster.description.present? ? "<p>#{ERB::Util.html_escape(@monster.description)}</p>" : '', public: '' }
    }
  end

  # "humanoid", "swarm of tiny beasts" (a swarm of beasts, each tiny), or a custom type
  def creature_type
    text = @monster.monster_type.to_s.downcase.strip
    swarm = text.match(SWARM)
    type = swarm ? swarm[2].singularize : text
    custom = text.present? && CREATURE_TYPES.exclude?(type)
    {
      value: custom ? 'custom' : type,
      subtype: @monster.monster_subtype.to_s,
      swarm: swarm ? SIZES.fetch(swarm[1].downcase) : '',
      custom: custom ? @monster.monster_type.to_s : ''
    }
  end

  def traits
    {
      size: size,
      languages: keyed(@monster.languages.to_s.split(','), LANGUAGES),
      di: damage_trait(@monster.damage_immunities),
      dr: damage_trait(@monster.damage_resistances),
      dv: damage_trait(@monster.damage_vulnerabilities),
      ci: keyed(@monster.condition_immunities, CONDITIONS.index_with(&:itself))
    }
  end

  def size
    SIZES[@monster.size.to_s.downcase] || 'med'
  end

  def damage_trait(values)
    keyed(values, DAMAGE_TYPES.index_with(&:itself)).merge(bypasses: [])
  end

  # { value: the keys dnd5e knows, custom: the rest, "; "-separated }
  def keyed(values, keys)
    names = Array(values).map { |value| value.to_s.strip }.compact_blank
    known, custom = names.partition { |name| keys.key?(name.downcase) }
    { value: known.map { |name| keys[name.downcase] }.uniq, custom: custom.join('; ') }
  end

  # Legendary actions are spent and recovered in dnd5e 6
  def resources
    legendary = @monster.legendary_actions.any? ? 3 : 0
    { legact: { max: legendary, spent: 0 }, legres: { max: 0, spent: 0 }, lair: { value: false } }
  end

  def prototype_token
    squares = TOKEN_SIZES.fetch(size)
    { name: @monster.name, actorLink: false, disposition: -1, width: squares, height: squares, texture: { src: IMG } }
  end
end
