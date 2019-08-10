# frozen_string_literal: true

class DndFunc
  def test_generate_npc
    campaign = Campaign.first
    user = User.find_by(username: 'jesshdm')
    new_npc = generate_npc('Arcus', 'Fighter', 'Half-orc', 'chaotic evil', 6, 'Villain', user, campaign, 14)
  end

  def generate_npc(name, dnd_class_name, race, alignment, level, role, user, campaign, min_score = 15)
    @new_npc = Character.create(name: name,
                                level: level,
                                role: role,
                                alignment: alignment)
    @new_npc.dnd_classes << DndClass.find_by(name: dnd_class_name)
    @new_npc.user = user
    @new_npc.campaign = campaign
    @new_npc.character_type = 'npc'
    @new_npc.race = race
    generate_ability_scores(min_score)
    set_statistics
    add_armor
    (1..rand(1..3)).each do
      add_weapon
    end
    @new_npc.save!
  end

  private

  def set_ability_scores(score_priority = [], min_score = 15)
    ability_scores = Array.new(6)
    ability_scores.each_with_index do |_, index|
      rolls = [rand(1..6), rand(1..6), rand(1..6), rand(1..6)]
      rolls.delete_at(rolls.index(rolls.min))
      ability_scores[index] = rolls.sum
    end
    score_priority.each_with_index do |ability, index|
      min_score_calc = index.zero? ? min_score : 0
      case ability
      when 'strength'
        @new_npc.strength = get_strength_for_race(
          [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
          @new_npc.race
        )
      when 'dexterity'
        @new_npc.dexterity = get_dexterity_for_race(
          [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
          @new_npc.race
        )
      when 'constitution'
        @new_npc.constitution = get_constitution_for_race(
          [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
          @new_npc.race
        )
      when 'intelligence'
        @new_npc.intelligence = get_intelligence_for_race(
          [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
          @new_npc.race
        )
      when 'wisdom'
        @new_npc.wisdom = get_wisdom_for_race(
          [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
          @new_npc.race
        )
      when 'charisma'
        @new_npc.charisma = get_charisma_for_race(
          [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
          @new_npc.race
        )
      end
    end
  end

  def generate_ability_scores(min_score = 15)
    case @new_npc.dnd_class_string
    when 'Barbarian'
      set_ability_scores(score_priority_for_barbarian, min_score)
    when 'Bard'
      set_ability_scores(score_priority_for_bard, min_score)
    when 'Cleric'
      set_ability_scores(score_priority_for_cleric, min_score)
    when 'Druid'
      set_ability_scores(score_priority_for_druid, min_score)
    when 'Fighter'
      set_ability_scores(score_priority_for_fighter, min_score)
    when 'Monk'
      set_ability_scores(score_priority_for_monk, min_score)
    when 'Paladin'
      set_ability_scores(score_priority_for_paladin, min_score)
    when 'Ranger'
      set_ability_scores(score_priority_for_ranger, min_score)
    when 'Rogue'
      set_ability_scores(score_priority_for_rogue, min_score)
    when 'Sorcerer'
      set_ability_scores(score_priority_for_sorcerer, min_score)
    when 'Warlock'
      set_ability_scores(score_priority_for_warlock, min_score)
    when 'Wizard'
      set_ability_scores(score_priority_for_wizard, min_score)
    else
      set_ability_scores
    end
  end

  def score_priority_for_barbarian
    fill_score_priorities(%w[strength constitution])
  end

  def score_priority_for_bard
    fill_score_priorities(%w[charisma dexterity])
  end

  def score_priority_for_cleric
    fill_score_priorities(%w[wisdom constitution])
  end

  def score_priority_for_druid
    fill_score_priorities(%w[wisdom charisma])
  end

  def score_priority_for_fighter
    fill_score_priorities(%w[strength dexterity constitution])
  end

  def score_priority_for_monk
    fill_score_priorities(%w[dexterity wisdom])
  end

  def score_priority_for_paladin
    fill_score_priorities(%w[strength charisma])
  end

  def score_priority_for_ranger
    fill_score_priorities(%w[dexterity wisdom])
  end

  def score_priority_for_rogue
    fill_score_priorities(%w[dexterity charisma intelligence])
  end

  def score_priority_for_sorcerer
    fill_score_priorities(%w[charisma intelligence])
  end

  def score_priority_for_warlock
    fill_score_priorities(%w[charisma intelligence])
  end

  def score_priority_for_wizard
    fill_score_priorities(%w[intelligence])
  end

  def fill_score_priorities(score_priorities)
    remaining_scores = %w[strength dexterity constitution intelligence wisdom charisma] - score_priorities
    score_priorities + remaining_scores.shuffle
  end

  def get_strength_for_race(score, race)
    case race.parameterize
    when 'human'
      score + 1
    when 'mountain-dwarf'
      score + 2
    when 'dragonborn'
      score + 2
    when 'half-orc'
      score + 2
    else
      score
    end
  end

  def get_dexterity_for_race(score, race)
    case race.parameterize
    when 'human'
      score + 1
    when 'elf' || 'high-elf' || 'wood-elf'
      score + 2
    when 'forest-gnome'
      score + 1
    when 'halfling' || 'stout-halfling' || 'lightfoot-halfling'
      score + 2
    else
      score
    end
  end

  def get_constitution_for_race(score, race)
    case race.parameterize
    when 'human'
      score + 1
    when 'dwarf' || 'mountain-dwarf' || 'hill-dwarf'
      score + 2
    when 'stout-halfling'
      score + 1
    when 'half-orc'
      score + 1
    when 'rock-gnome'
      score + 1
    else
      score
    end
  end

  def get_intelligence_for_race(score, race)
    case race.parameterize
    when 'human'
      score + 1
    when 'high-elf'
      score + 1
    when 'gnome' || 'rock-gnome' || 'forest-gnome'
      score + 2
    when 'tiefling'
      score + 1
    else
      score
    end
  end

  def get_wisdom_for_race(score, race)
    case race.parameterize
    when 'human'
      score + 1
    when 'hill-dwarf'
      score + 1
    when 'wood-elf'
      score + 1
    else
      score
    end
  end

  def get_charisma_for_race(score, race)
    case race.parameterize
    when 'human'
      score + 1
    when 'drow'
      score + 1
    when 'half-elf'
      score + 2
    when 'dragonborn'
      score + 1
    when 'lightfoot-halfling'
      score + 1
    when 'tiefling'
      score + 2
    else
      score
    end
  end

  def ability_score_modifier(ability_score)
    case ability_score
    when 1
      -5
    when 2..3
      -4
    when 4..5
      -3
    when 6..7
      -2
    when 8..9
      -1
    when 10..11
      0
    when 12..13
      1
    when 14..15
      2
    when 16..17
      3
    when 18..19
      4
    when 20..21
      5
    when 22..23
      6
    when 24..25
      7
    when 26..27
      8
    when 18..29
      9
    else
      10
    end
  end

  def set_statistics
    @new_npc.initiative = ability_score_modifier(@new_npc.dexterity)
    @new_npc.proficiency = case @new_npc.level
                           when 0
                             1
                           when 1..4
                             2
                           when 5..8
                             3
                           when 9..12
                             4
                           when 13..16
                             5
                           else
                             6
                           end
    @new_npc.hit_dice_value = case @new_npc.dnd_class_string
                              when 'Barbarian'
                                12
                              when 'Bard' || 'Cleric' || 'Druid' || 'Monk' || 'Rogue' || 'Warlock'
                                8
                              when 'Fighter' || 'Paladin' || 'Ranger'
                                10
                              when 'Sorcerer' || 'Wizard'
                                6
                              else
                                8
                              end
    @new_npc.hit_dice_number = @new_npc.level
    @new_npc.hit_points = @new_npc.hit_dice_value + ability_score_modifier(@new_npc.constitution)
    (1..@new_npc.hit_dice_number - 1).each do
      @new_npc.hit_points += rand(1..@new_npc.hit_dice_value)
    end
    @new_npc.hit_points_current = @new_npc.hit_points
  end

  def add_armor
    armor_profs = @new_npc.dnd_class.profs.where(prof_type: 'Armor').pluck(:name)
    armor_choices = get_armor_choices(armor_profs)
    armor_probabilities = probabilities(armor_choices)
    armor_choice_weight = get_weight(armor_probabilities)
    armor = by_weight(armor_choices, armor_choice_weight).sample[:item]
    armor_item = EquipmentItem.create(quantity: 1)
    armor_item.items << armor
    @new_npc.equipment_items << armor_item
    @new_npc.armor_class = if armor.armor_class
                             if armor.armor_dex_bonus
                               armor.armor_class + ability_score_modifier(@new_npc.dexterity)
                             else
                               armor.armor_class
                             end
                           else
                             10 + ability_score_modifier(@new_npc.dexterity)
                           end
  end

  def get_armor_choices(armor_profs)
    armor_choices = []
    armor_profs.each do |armor_prof|
      case armor_prof
      when 'Light armor'
        Item.where(category: 'Armor').where(sub_category: 'Light').each do |armor_item|
          armor_choices << { item: armor_item, weight: 1 }
        end
      when 'Medium armor'
        Item.where(category: 'Armor').where(sub_category: 'Medium').each do |armor_item|
          armor_choices << { item: armor_item, weight: 2 }
        end
      when 'Heavy armor'
        Item.where(category: 'Armor').where(sub_category: 'Heavy').each do |armor_item|
          armor_choices << { item: armor_item, weight: 4 }
        end
      when 'All armor'
        Item.where(category: 'Armor').where(sub_category: 'Light').each do |armor_item|
          armor_choices << { item: armor_item, weight: 1 }
        end
        Item.where(category: 'Armor').where(sub_category: 'Medium').each do |armor_item|
          armor_choices << { item: armor_item, weight: 2 }
        end
        Item.where(category: 'Armor').where(sub_category: 'Heavy').each do |armor_item|
          armor_choices << { item: armor_item, weight: 8 }
        end
      end
    end
    armor_choices
  end

  def add_weapon
    weapon_profs = @new_npc.dnd_class.profs.where(prof_type: 'Weapons').pluck(:name)
    weapon_choices = get_weapon_choices(weapon_profs)
    weapon_probabilities = probabilities(weapon_choices)
    weapon_choice_weight = get_weight(weapon_probabilities)
    weapon = by_weight(weapon_choices, weapon_choice_weight).sample[:item]
    weapon_item = EquipmentItem.create(quantity: 1)
    weapon_item.items << weapon
    @new_npc.equipment_items << weapon_item
    attack_action = CharacterAction.create(
      name: weapon.name,
      description: weapon.description
    )
    if weapon.weapon_2h_damage_type
      attack_action.damage_dice = "1h: #{weapon.weapon_damage_dice_count}d#{weapon.weapon_damage_dice_value} #{weapon.weapon_damage_type}, 2h: #{weapon.weapon_2h_damage_dice_count}d#{weapon.weapon_2h_damage_dice_value} #{weapon.weapon_2h_damage_type}"
    else
      attack_action.damage_dice = "1h: #{weapon.weapon_damage_dice_count}d#{weapon.weapon_damage_dice_value} #{weapon.weapon_damage_type}"
    end
    if weapon.weapon_range.include? 'Ranged'
      attack_action.attack_bonus = ability_score_modifier(@new_npc.dexterity)
      attack_action.damage_bonus = ability_score_modifier(@new_npc.dexterity)
    else
      attack_action.attack_bonus = ability_score_modifier(@new_npc.strength)
      attack_action.damage_bonus = ability_score_modifier(@new_npc.strength)
    end
    @new_npc.character_actions << attack_action
  end

  def get_weapon_choices(weapon_profs)
    weapon_choices = []
    weapon_profs.each do |weapon_prof|
      case weapon_prof
      when 'Simple weapons'
        Item.where(category: 'Weapon').where(sub_category: 'Simple').each do |weapon_item|
          weapon_choices << { item: weapon_item, weight: 2 }
        end
      when 'Martial weapons'
        Item.where(category: 'Weapon').where(sub_category: 'Martial').each do |weapon_item|
          weapon_choices << { item: weapon_item, weight: 3 }
        end
      else
        Item.where(category: 'Weapon').where('name like ?', "%#{weapons_prof.delete_suffix('s')}").each do |weapon_item|
          weapon_choices << { item: weapon_item, weight: 1 }
        end
      end
    end
    weapon_choices
  end

  # Probability Calculation

  def sum_of_weights(weighted_items)
    weighted_items.sum { |weighted_item| weighted_item[:weight].to_f }
  end

  def probabilities(weighted_items)
    sum_of_weights = sum_of_weights(weighted_items)

    # initial probability
    probability = 0.0

    weights = weighted_items.map { |w| w[:weight] }.uniq.sort
    weights.map do |w|
      current_probability = (w / sum_of_weights).round(3)
      # sum the current_probability with the previous
      probability += current_probability
      { weight: w, probability: probability }
    end
  end

  def get_weight(probabilities)
    r = rand
    probabilities.each do |p|
      # puts "Weight: #{p[:weight]} - rand: #{r}, probability: #{p[:probability]}"
      return p[:weight] if r < p[:probability]
    end
    probabilities.first[:weight]
  end

  def by_weight(items, weight)
    # puts items
    # puts "Item weight: #{weight}"
    items.select { |el| el[:weight] == weight }
  end
end
