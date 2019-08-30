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

    def generate_npc(npc_attributes)
      @new_npc = NonPlayerCharacter.create(name: npc_attributes[:name],
                                           race: npc_attributes[:race],
                                           role: npc_attributes[:role],
                                           user_id: npc_attributes[:user_id],
                                           alignment: npc_attributes[:alignment],
                                           campaign_ids: npc_attributes[:campaign_ids],
                                           character_classes_attributes: npc_attributes[:character_classes_attributes])

      generate_ability_scores(npc_attributes[:min_score])
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
        rolls = [DndRules.roll_dice(1, 6),
                 DndRules.roll_dice(1, 6),
                 DndRules.roll_dice(1, 6),
                 DndRules.roll_dice(1, 6)]
        rolls.delete_at(rolls.index(rolls.min))
        ability_scores[index] = rolls.sum
      end
      score_priority.each_with_index do |ability, index|
        set_primary_ability(ability, ability_scores, index, min_score)
      end
    end

    def set_primary_ability(ability, ability_scores, index, min_score)
      min_score_calc = index.zero? ? min_score.to_i : 0
      highest_score = [ability_scores.delete_at(ability_scores.index(ability_scores.max)), min_score_calc].max
      case ability
      when 'Strength'
        @new_npc.strength = DndRules.get_strength_for_race(highest_score, @new_npc.race)
      when 'Dexterity'
        @new_npc.dexterity = DndRules.get_dexterity_for_race(highest_score, @new_npc.race)
      when 'Constitution'
        @new_npc.constitution = DndRules.get_constitution_for_race(highest_score, @new_npc.race)
      when 'Intelligence'
        @new_npc.intelligence = DndRules.get_intelligence_for_race(highest_score, @new_npc.race)
      when 'Wisdom'
        @new_npc.wisdom = DndRules.get_wisdom_for_race(highest_score, @new_npc.race)
      when 'Charisma'
        @new_npc.charisma = DndRules.get_charisma_for_race(highest_score, @new_npc.race)
      end
    end

    def generate_ability_scores(min_score = 15)
      primary_abilities = []
      @new_npc.character_classes.each do |character_class|
        primary_abilities += character_class.dnd_class.primary_abilities
      end
      primary_abilities = primary_abilities.uniq
      score_priorities = fill_score_priorities(primary_abilities)
      set_ability_scores(score_priorities, min_score)
    end

    def fill_score_priorities(score_priorities)
      remaining_scores = %w[Strength Dexterity Constitution Intelligence Wisdom Charisma] - score_priorities
      score_priorities + remaining_scores.shuffle
    end

    def set_statistics
      @new_npc.initiative = DndRules.ability_score_modifier(@new_npc.dexterity)
      @new_npc.proficiency = DndRules.proficiency_bonus_for_level(@new_npc.total_level)
      @new_npc.hit_points = @new_npc.hit_dice_value + DndRules.ability_score_modifier(@new_npc.constitution)
      @new_npc.hit_points += DndRules.roll_dice(@new_npc.hit_dice_number - 1, @new_npc.hit_dice_value)
      @new_npc.hit_points_current = @new_npc.hit_points
      @new_npc.each do |ch|
        ch.setup_spell_scores(@new_npc)
      end
    end

    # Armor

    def add_armor
      armor_profs = []
      @new_npc.character_classes.each do |character_class|
        cc_armor_profs = character_class.dnd_class.profs.where(prof_type: 'Armor').pluck(:name)
        armor_profs += cc_armor_profs
      end
      armor_profs = armor_profs.uniq
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
          ArmorItem.where(sub_category: 'Light').each do |armor_item|
            armor_choices << { item: armor_item, weight: get_weight_for_magic_item(armor_item.rarity, 5000) }
          end
        when 'Medium armor'
          ArmorItem.where(sub_category: 'Medium').each do |armor_item|
            armor_choices << { item: armor_item, weight: get_weight_for_magic_item(armor_item.rarity, 10000) }
          end
        when 'Heavy armor'
          ArmorItem.where(sub_category: 'Heavy').each do |armor_item|
            armor_choices << { item: armor_item, weight: get_weight_for_magic_item(armor_item.rarity, 20000) }
          end
        when 'All armor'
          ArmorItem.where(sub_category: 'Light').each do |armor_item|
            armor_choices << { item: armor_item, weight: get_weight_for_magic_item(armor_item.rarity, 5000) }
          end
          ArmorItem.where(sub_category: 'Medium').each do |armor_item|
            armor_choices << { item: armor_item, weight: get_weight_for_magic_item(armor_item.rarity, 10000) }
          end
          ArmorItem.where(sub_category: 'Heavy').each do |armor_item|
            armor_choices << { item: armor_item, weight: get_weight_for_magic_item(armor_item.rarity, 20000) }
          end
        end
      end
      armor_choices
    end

    # Weapon

    def add_weapon
      weapon_profs = []
      @new_npc.character_classes.each do |character_class|
        cc_weapon_profs = character_class.dnd_class.profs.where(prof_type: 'Weapons').pluck(:name)
        weapon_profs += cc_weapon_profs
      end
      weapon_profs = weapon_profs.uniq
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
          WeaponItem.where(sub_category: 'Simple').each do |weapon_item|
            weapon_weight = get_weight_for_magic_item(weapon_item.rarity, 5000)
            weapon_choices << { item: weapon_item, weight: weapon_weight }
          end
        when 'Martial weapons'
          WeaponItem.where(sub_category: 'Martial').each do |weapon_item|
            weapon_weight = get_weight_for_magic_item(weapon_item.rarity, 15000)
            weapon_choices << { item: weapon_item, weight: weapon_weight }
          end
        else
          WeaponItem.where('name like ?', "%#{weapon_prof.chomp('s')}").each do |weapon_item|
            weapon_weight = get_weight_for_magic_item(weapon_item.rarity, 20000)
            weapon_choices << { item: weapon_item, weight: weapon_weight }
          end
        end
      end
      weapon_choices
    end

    def get_weight_for_magic_item(rarity = nil, default_weight = 500)
      case rarity
      when 'common'
        3 * @new_npc.total_level
      when 'uncommon'
        2 * @new_npc.total_level
      when 'rare', 'very rare'
        @new_npc.total_level
      when 'legendary', 'artifact'
        1
      else
        default_weight
      end
    end

    def add_skills
      proficiency_choices = []
      @new_npc.character_classes.each do |character_class|
        cc_prof_choices = character_class.dnd_class.prof_choices
        proficiency_choices += cc_prof_choices
      end
      proficiency_choices = proficiency_choices.uniq
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
      spell_slots = []
      @new_npc.character_classes.each do |character_class|
        slots = SpellSlots.spell_slots(character_class)
        next if slots.nil?
        spell_slots << {
          dnd_class: character_class.dnd_class.name,
          slots: slots
        }
      end
      spell_slots.each do |class_slots|
        add_spells_for_level(0, class_slots[:dnd_class], class_slots[:slots][:cantrips])
        if class_slots[:dnd_class] != 'Warlock'
          add_spells_for_level(1, class_slots[:dnd_class], class_slots[:slots][:level_1])
          add_spells_for_level(2, class_slots[:dnd_class], class_slots[:slots][:level_2])
          add_spells_for_level(3, class_slots[:dnd_class], class_slots[:slots][:level_3])
          add_spells_for_level(4, class_slots[:dnd_class], class_slots[:slots][:level_4])
          add_spells_for_level(5, class_slots[:dnd_class], class_slots[:slots][:level_5])
          add_spells_for_level(6, class_slots[:dnd_class], class_slots[:slots][:level_6])
          add_spells_for_level(7, class_slots[:dnd_class], class_slots[:slots][:level_7])
          add_spells_for_level(8, class_slots[:dnd_class], class_slots[:slots][:level_8])
          add_spells_for_level(9, class_slots[:dnd_class], class_slots[:slots][:level_9])
        else
          spells_known = []
          (1..class_slots[:slots][:total_known]).each do
            spell_level = rand(1..class_slots[:slots][:slot_level])
            spell = SpellSlots.random_spell(class_slots[:dnd_class], spell_level, spells_known)
            next if spell.nil?

            spells_known << spell
            @new_npc.character_spells << CharacterSpell.new(is_prepared: false,
                                                            spell_class: class_slots[:dnd_class],
                                                            spell: spell)
          end
        end
      end
    end

    def add_spells_for_level(level, dnd_class, num_spells)
      spells_known = []
      (1..num_spells).each do
        spell = SpellSlots.random_spell(dnd_class, level, spells_known)
        spells_known << spell
        @new_npc.character_spells << CharacterSpell.new(is_prepared: dnd_class == 'Warlock',
                                              spell_class: dnd_class,
                                              spell: spell)
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
