# frozen_string_literal: true

class NpcGenerator
  class << self

    def generate_npc(npc_attributes)
      @new_npc = NonPlayerCharacter.create(name: npc_attributes[:name],
                                           race_id: npc_attributes[:race_id],
                                           role: npc_attributes[:role],
                                           alignment: npc_attributes[:alignment],
                                           campaign_id: npc_attributes[:campaign_id],
                                           character_classes_attributes: npc_attributes[:character_classes_attributes])

      generate_ability_scores(npc_attributes[:min_score])
      set_statistics
      armor_ids = []
      rand(1..3).times do
        armor_ids << add_armor(armor_ids)
      end
      weapon_ids = []
      rand(1..5).times do
        weapon_ids << add_weapon(weapon_ids)
      end
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
        @new_npc.strength = highest_score + @new_npc.race.strength_modifier
      when 'Dexterity'
        @new_npc.dexterity = highest_score + @new_npc.race.dexterity_modifier
      when 'Constitution'
        @new_npc.constitution = highest_score + @new_npc.race.constitution_modifier
      when 'Intelligence'
        @new_npc.intelligence = highest_score + @new_npc.race.intelligence_modifier
      when 'Wisdom'
        @new_npc.wisdom = highest_score + @new_npc.race.wisdom_modifier
      when 'Charisma'
        @new_npc.charisma = highest_score + @new_npc.race.charisma_modifier
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
      @new_npc.hit_points = 0
      @new_npc.character_classes.each do |character_class|
        @new_npc.hit_points += character_class.dnd_class.hit_die + DndRules.ability_score_modifier(@new_npc.constitution)
        if character_class.level > 1
          @new_npc.hit_points += DndRules.roll_dice(character_class.level - 1, character_class.dnd_class.hit_die)
        end
      end
      @new_npc.hit_points_current = @new_npc.hit_points
      @new_npc.character_classes.each do |ch|
        ch.setup_spell_scores(@new_npc)
      end

      @new_npc.armor_class = 10 + DndRules.ability_score_modifier(@new_npc.dexterity)
      @new_npc.speed = @new_npc.race.speed
    end

    # Armor

    def add_armor(armor_ids)
      armor_profs = []
      @new_npc.character_classes.each do |character_class|
        cc_armor_profs = character_class.dnd_class.profs.where(prof_type: 'Armor').pluck(:name)
        armor_profs += cc_armor_profs
      end
      armor_profs = armor_profs.uniq
      if armor_profs.any?
        armor_choices = get_armor_choices(armor_profs, armor_ids)
        armor = armor_choices.sample
        @new_npc.character_items.create(
          quantity: 1,
          equipped: false,
          carrying: true,
          item: armor
        )
        armor.id
      end
    end

    def get_armor_choices(armor_profs, armor_ids)
      armor_choices = []
      armor_profs.each do |armor_prof|
        case armor_prof
        when 'Light armor'
          ArmorItem.where(sub_category: 'Light').each do |armor_item|
            if armor_ids.exclude?(armor_item.id)
              armor_weight = get_weight_for_magic_item(armor_item.rarity, 200)
              armor_weight.times { armor_choices << armor_item }
            end
          end
        when 'Medium armor'
          ArmorItem.where(sub_category: 'Medium').each do |armor_item|
            if armor_ids.exclude?(armor_item.id)
              armor_weight = get_weight_for_magic_item(armor_item.rarity, 200)
              armor_weight.times { armor_choices << armor_item }
            end
          end
        when 'Heavy armor'
          ArmorItem.where(sub_category: 'Heavy').each do |armor_item|
            if armor_ids.exclude?(armor_item.id)
              armor_weight = get_weight_for_magic_item(armor_item.rarity, 200)
              armor_weight.times { armor_choices << armor_item }
            end
          end
        when 'All armor'
          ArmorItem.where(sub_category: 'Light').each do |armor_item|
            if armor_ids.exclude?(armor_item.id)
              armor_weight = get_weight_for_magic_item(armor_item.rarity, 25)
              armor_weight.times { armor_choices << armor_item }
            end
          end
          ArmorItem.where(sub_category: 'Medium').each do |armor_item|
            if armor_ids.exclude?(armor_item.id)
              armor_weight = get_weight_for_magic_item(armor_item.rarity, 100)
              armor_weight.times { armor_choices << armor_item }
            end
          end
          ArmorItem.where(sub_category: 'Heavy').each do |armor_item|
            if armor_ids.exclude?(armor_item.id)
              armor_weight = get_weight_for_magic_item(armor_item.rarity, 250)
              armor_weight.times { armor_choices << armor_item }
            end
          end
        end
      end
      armor_choices
    end

    # Weapon

    def add_weapon(weapon_ids)
      weapon_profs = []
      @new_npc.character_classes.each do |character_class|
        cc_weapon_profs = character_class.dnd_class.profs.where(prof_type: 'Weapons').pluck(:name)
        weapon_profs += cc_weapon_profs
      end
      weapon_profs = weapon_profs.uniq
      if weapon_profs.any?
        weapon_choices = get_weapon_choices(weapon_profs, weapon_ids)
        weapon = weapon_choices.sample
        @new_npc.character_items.create(
          quantity: 1,
          equipped: false,
          carrying: true,
          item: weapon
        )
        weapon.id
      end
    end

    def get_weapon_choices(weapon_profs, weapon_ids)
      weapon_choices = []
      weapon_profs.each do |weapon_prof|
        case weapon_prof
        when 'Simple weapons'
          WeaponItem.where(sub_category: 'Simple').each do |weapon_item|
            if weapon_ids.exclude?(weapon_item.id)
              weapon_weight = get_weight_for_magic_item(weapon_item.rarity, 75)
              weapon_weight.times { weapon_choices << weapon_item }
            end
          end
        when 'Martial weapons'
          WeaponItem.where(sub_category: 'Martial').each do |weapon_item|
            if weapon_ids.exclude?(weapon_item.id)
              weapon_weight = get_weight_for_magic_item(weapon_item.rarity, 150)
              weapon_weight.times { weapon_choices << weapon_item }
            end
          end
        else
          WeaponItem.where('name like ?', "%#{weapon_prof.chomp('s')}").each do |weapon_item|
            if weapon_ids.exclude?(weapon_item.id)
              weapon_weight = get_weight_for_magic_item(weapon_item.rarity, 200)
              weapon_weight.times { weapon_choices << weapon_item }
            end
          end
        end
      end
      weapon_choices
    end

    def get_weight_for_magic_item(rarity = nil, default_weight = 200)
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
