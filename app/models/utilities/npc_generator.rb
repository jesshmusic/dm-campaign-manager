# frozen_string_literal: true

class NpcGenerator
  class << self
    def test_generate_npc(level = nil, dnd_class = nil)
      campaign = Campaign.first
      user = User.find_by(username: 'jesshdm')
      random_name = NameGen.random_name(%w[male female].sample)
      random_class = dnd_class || DndClass.all.sample
      random_level = level.nil? ? rand(6..15) : level
      puts "Creating NPC #{random_name}, level #{random_level} #{random_class}"
      puts DndRules.xp_for_cr('1/4')
      random_race = DndRules.random_race
      test_npc = generate_npc(
        random_name, random_class, random_race,
        DndRules.random_alignment, random_level, 'Test NPC',
        user, campaign, 14
      )
      if test_npc.save
        puts "Generated test NPC: #{test_npc.name}, level #{test_npc.level} #{test_npc.race} #{test_npc.dnd_class_string}"
      else
        puts test_npc.errors
      end
    end

    def generate_npc(name, dnd_class, race, alignment, level, role, user, campaign, min_score = 15)
      @new_npc = Character.create(name: name,
                                  level: level,
                                  role: role,
                                  alignment: alignment)
      @new_npc.dnd_classes << dnd_class
      @new_npc.user = user
      @new_npc.campaign = campaign
      @new_npc.character_type = 'npc'
      @new_npc.race = race
      generate_ability_scores(min_score)
      set_statistics
      add_armor
      add_weapon
      add_skills
      add_spells
      add_treasure
      @new_npc.xp = DndRules.xp_for_cr(@new_npc.challenge_rating)
      @new_npc
    end

    private

    # Statistics

    def set_ability_scores(score_priority = [], min_score = 15)
      ability_scores = Array.new(6)
      ability_scores.each_with_index do |_, index|
        rolls = [DndRules.roll_dice(1, 6), DndRules.roll_dice(1, 6), DndRules.roll_dice(1, 6), DndRules.roll_dice(1, 6)]
        rolls.delete_at(rolls.index(rolls.min))
        ability_scores[index] = rolls.sum
      end
      score_priority.each_with_index do |ability, index|
        min_score_calc = index.zero? ? min_score.to_i : 0
        case ability
        when 'strength'
          @new_npc.strength = DndRules.get_strength_for_race(
            [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
            @new_npc.race
          )
        when 'dexterity'
          @new_npc.dexterity = DndRules.get_dexterity_for_race(
            [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
            @new_npc.race
          )
        when 'constitution'
          @new_npc.constitution = DndRules.get_constitution_for_race(
            [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
            @new_npc.race
          )
        when 'intelligence'
          @new_npc.intelligence = DndRules.get_intelligence_for_race(
            [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
            @new_npc.race
          )
        when 'wisdom'
          @new_npc.wisdom = DndRules.get_wisdom_for_race(
            [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max,
            @new_npc.race
          )
        when 'charisma'
          @new_npc.charisma = DndRules.get_charisma_for_race(
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

    def set_statistics
      @new_npc.initiative = DndRules.ability_score_modifier(@new_npc.dexterity)
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
                                when 'Bard', 'Cleric', 'Druid', 'Monk', 'Rogue', 'Warlock'
                                  8
                                when 'Fighter', 'Paladin', 'Ranger'
                                  10
                                when 'Sorcerer', 'Wizard'
                                  6
                                else
                                  8
                                end
      spell_casting = SpellSlots.spell_ability(@new_npc)
      @new_npc.spell_save_dc = spell_casting[:mod] + @new_npc.proficiency + 8
      @new_npc.spell_attack_bonus = spell_casting[:mod] + @new_npc.proficiency
      @new_npc.spell_ability = spell_casting[:ability]
      @new_npc.hit_dice_number = @new_npc.level
      @new_npc.hit_points = @new_npc.hit_dice_value + DndRules.ability_score_modifier(@new_npc.constitution)
      @new_npc.hit_points += DndRules.roll_dice(@new_npc.hit_dice_number - 1, @new_npc.hit_dice_value)
      @new_npc.hit_points_current = @new_npc.hit_points
    end

    # Armor

    def add_armor
      armor_profs = @new_npc.dnd_class.profs.where(prof_type: 'Armor').pluck(:name)
      if armor_profs.any?
        armor_choices = get_armor_choices(armor_profs)
        armor = DndRules.get_weighted_random_record(armor_choices)
        armor_item = EquipmentItem.create(quantity: 1)
        armor_item.items << armor
        @new_npc.equipment_items << armor_item
        @new_npc.armor_class = if armor.armor_class
                                 if armor.armor_dex_bonus
                                   armor.armor_class + DndRules.ability_score_modifier(@new_npc.dexterity)
                                 else
                                   armor.armor_class
                                 end
                               else
                                 10 + DndRules.ability_score_modifier(@new_npc.dexterity)
                               end
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

    # Weapon

    def add_weapon
      weapon_profs = @new_npc.dnd_class.profs.where(prof_type: 'Weapons').pluck(:name)
      if weapon_profs.any?
        weapon_choices = get_weapon_choices(weapon_profs)
        weapon = DndRules.get_weighted_random_record(weapon_choices)
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
          attack_action.attack_bonus = DndRules.ability_score_modifier(@new_npc.dexterity) + @new_npc.proficiency
          attack_action.damage_bonus = DndRules.ability_score_modifier(@new_npc.dexterity) + @new_npc.proficiency
        else
          attack_action.attack_bonus = DndRules.ability_score_modifier(@new_npc.strength) + @new_npc.proficiency
          attack_action.damage_bonus = DndRules.ability_score_modifier(@new_npc.strength) + @new_npc.proficiency
        end
        @new_npc.character_actions << attack_action
      end
    end

    def get_weapon_choices(weapon_profs)
      weapon_choices = []
      weapon_profs.each do |weapon_prof|
        case weapon_prof
        when 'Simple weapons'
          Item.where(category: 'Weapon').where(sub_category: 'Simple').each do |weapon_item|
            weapon_choices << { item: weapon_item, weight: 5 }
          end
        when 'Martial weapons'
          Item.where(category: 'Weapon').where(sub_category: 'Martial').each do |weapon_item|
            weapon_choices << { item: weapon_item, weight: 15 }
          end
        else
          Item.where(category: 'Weapon').where('name like ?', "%#{weapon_prof.chomp('s')}").each do |weapon_item|
            weapon_choices << { item: weapon_item, weight: 1 }
          end
        end
      end
      weapon_choices
    end

    def add_skills
      proficiency_choices = @new_npc.dnd_class.prof_choices
      proficiency_choices.each do |prof_choice|
        next unless prof_choice.profs.first.prof_type == 'Skills'
        exclude_list = []
        (1..prof_choice.num_choices).each do
          skill_choice = DndRules.skill_from_profs(prof_choice.profs, exclude_list)
          skill_score = case skill_choice[:ability]
                        when 'strength'
                          DndRules.ability_score_modifier(@new_npc.strength)
                        when 'dexterity'
                          DndRules.ability_score_modifier(@new_npc.dexterity)
                        when 'constitution'
                          DndRules.ability_score_modifier(@new_npc.constitution)
                        when 'intelligence'
                          DndRules.ability_score_modifier(@new_npc.intelligence)
                        when 'wisdom'
                          DndRules.ability_score_modifier(@new_npc.wisdom)
                        when 'charisma'
                          DndRules.ability_score_modifier(@new_npc.charisma)
                        else
                          0
                        end
          exclude_list << skill_choice[:new_exclude]
          @new_npc.skills << Skill.create(
            name: skill_choice[:name],
            score: skill_score
          )
        end
      end
    end

    def add_spells
      # TODO: Simple initial implementation
      spell_slots = SpellSlots.spell_slots(@new_npc)
      if spell_slots
        add_spells_for_level(0, spell_slots[:cantrips])
        if @new_npc.dnd_class_string != 'Warlock'
          add_spells_for_level(1, spell_slots[:level_1])
          add_spells_for_level(2, spell_slots[:level_2])
          add_spells_for_level(3, spell_slots[:level_3])
          add_spells_for_level(4, spell_slots[:level_4])
          add_spells_for_level(5, spell_slots[:level_5])
          add_spells_for_level(6, spell_slots[:level_6])
          add_spells_for_level(7, spell_slots[:level_7])
          add_spells_for_level(8, spell_slots[:level_8])
          add_spells_for_level(9, spell_slots[:level_9])
        else
          spells_known = []
          (1..spell_slots[:total_known]).each do
            spell_level = rand(1..spell_slots[:slot_level])
            spell = SpellSlots.random_spell(@new_npc.dnd_class_string, spell_level, spells_known)
            next if spell.nil?
            spells_known << spell
            @new_npc.spells << spell
          end
        end
      end
    end

    def add_spells_for_level(level, num_spells)
      spells_known = []
      (1..num_spells).each do
        spell = SpellSlots.random_spell(@new_npc.dnd_class_string, level, spells_known)
        spells_known << spell
        @new_npc.spells << spell
      end
    end

    # Treasure

    def add_treasure
      individual_treasure = TreasureUtility.create_individual_treasure(@new_npc.challenge_rating)
      # Coin by Level
      @new_npc.copper_pieces = individual_treasure[:copper_pieces]
      @new_npc.silver_pieces = individual_treasure[:silver_pieces]
      @new_npc.electrum_pieces = individual_treasure[:electrum_pieces]
      @new_npc.gold_pieces = individual_treasure[:gold_pieces]
      @new_npc.platinum_pieces = individual_treasure[:platinum_pieces]
    end
  end
end
