class MonstersUtil
  class << self
    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def dnd_open5e_url
      ImportSrdUtilities.dnd_open5e_url
    end

    def import_monsters
      puts 'Importing Monsters'
      next_uri = URI("#{dnd_api_url}/api/monsters/")
      count = 0
      while next_uri
        response = Net::HTTP.get(next_uri)
        result = JSON.parse response, symbolize_names: true
        next_uri = result[:next] ? URI(result[:next]) : false
        result[:results].each do |monster_ref|
          monster_uri = URI("#{dnd_api_url}#{monster_ref[:url]}")
          monster_response = Net::HTTP.get(monster_uri)
          monster = JSON.parse monster_response, symbolize_names: true
          new_monster = Monster.find_or_initialize_by(name: monster[:name])

          # Required Fields
          import_required_fields(new_monster, monster)

          import_info(new_monster, monster)
          import_damage_immunities(new_monster, monster)
          import_damage_resistances(new_monster, monster)
          import_damage_vulnerabilities(new_monster, monster)

          import_speeds(new_monster, monster)
          import_senses(new_monster, monster)

          # Statistics
          import_stats(new_monster, monster)

          # Actions
          import_actions(new_monster, monster)
          import_legendary_actions(new_monster, monster)
          import_reactions(new_monster, monster)
          import_special_abilities(new_monster, monster)

          # Proficiencies
          import_profs(new_monster, monster)

          # Condition Immunities
          import_condition_immunities(new_monster, monster)

          new_monster.save!
          puts "\tMonster: #{new_monster.name} added to database"
          count += 1
        end
      end
      puts "Monsters: #{count} monsters imported and updated or created."
    end

    private

    def import_actions(new_monster, monster)
      unless monster[:actions].nil?
        monster[:actions].each do |action|
          act = new_monster.actions.create(name: action[:name], desc: action[:desc], attack_bonus: action[:attack_bonus])
          parse_action(act, action)
        end
      end
    end

    def import_legendary_actions(new_monster, monster)
      unless monster[:legendary_actions].nil?
        monster[:legendary_actions].each do |action|
          act = new_monster.legendary_actions.create(name: action[:name], desc: action[:desc], attack_bonus: action[:attack_bonus])
          parse_action(act, action)
        end
      end
    end

    def import_reactions(new_monster, monster)
      unless monster[:reactions].nil?
        monster[:reactions].each do |action|
          act = new_monster.reactions.create(name: action[:name], desc: action[:desc], attack_bonus: action[:attack_bonus])
          parse_action(act, action)
        end
      end
    end

    def import_special_abilities(new_monster, monster)
      unless monster[:special_abilities].nil?
        monster[:special_abilities].each do |action|
          act = new_monster.special_abilities.create(name: action[:name], desc: action[:desc], attack_bonus: action[:attack_bonus])
          parse_action(act, action)
        end
      end
    end

    def parse_action(act, action)
      unless action[:dc].nil?
        act.dc_type = action[:dc][:dc_type][:name]
        act.dc_value = action[:dc][:dc_value]
        act.success_type = action[:dc][:success_type]
      end
      unless action[:usage].nil?
        act.usage_dice = action[:usage][:dice]
        act.usage_min_value = action[:usage][:min_value]
        act.usage_type = action[:usage][:type]
      end
      unless action[:damage].nil?
        action[:damage].each do |damage|
          if damage[:type].nil?
            damage_dice = DndRules.parse_dice_string(damage[:damage_dice])
            act.action_damages.create(damage_bonus: damage_dice[:hit_dice_modifier],
                                      damage_type: damage[:damage_type][:name],
                                      dice_count: damage_dice[:hit_dice_number],
                                      dice_value: damage_dice[:hit_dice_value])
          else
            damage[:from].each do |damage_choice|
              damage_dice = DndRules.parse_dice_string(damage_choice[:damage_dice])
              act.action_damages.create(damage_bonus: damage_dice[:hit_dice_modifier],
                                        damage_type: damage_choice[:damage_type][:name],
                                        dice_count: damage_dice[:hit_dice_number],
                                        dice_value: damage_dice[:hit_dice_value])
            end
          end
        end
      end
      act.save!
    end

    def import_required_fields(new_monster, monster)
      new_monster.slug = new_monster.slug || monster[:index]
      new_monster.alignment = monster[:alignment] || 'unaligned'
      new_monster.challenge_rating = DndRules.cr_num_to_string(monster[:challenge_rating])
      new_monster.monster_type = monster[:type]
      new_monster.save!
    end

    def import_info(new_monster, monster)
      new_monster.api_url = "/v1/monsters/#{new_monster.slug}"
      new_monster.languages = monster[:languages]
      new_monster.size = monster[:size]
      new_monster.monster_subtype = monster[:subtype] || ''
    end

    def import_damage_resistances(new_monster, monster)
      unless monster[:damage_resistances].nil?
        monster[:damage_resistances].each do |damage|
          new_monster.damage_resistances.create(name: damage)
        end
      end
    end

    def import_damage_vulnerabilities(new_monster, monster)
      unless monster[:damage_vulnerabilities].nil?
        monster[:damage_vulnerabilities].each do |damage|
          new_monster.damage_vulnerabilities.create(name: damage)
        end
      end
    end

    def import_damage_immunities(new_monster, monster)
      unless monster[:damage_immunities].nil?
        monster[:damage_immunities].each do |damage|
          new_monster.damage_immunities.create(name: damage)
        end
      end
    end

    def import_speeds(new_monster, monster)
      unless monster[:speed].nil?
        monster[:speed].each_key do |key|
          value = monster[:speed][key] == true ? 1 : monster[:speed][key].to_i
          new_monster.speeds.create(name: key.to_s.titleize, value: value)
        end
      end
    end

    def import_senses(new_monster, monster)
      unless monster[:senses].nil?
        monster[:senses].each_key do |key|
          new_monster.senses.create(name: key.to_s.titleize, value: monster[:senses][key].to_s)
        end
      end
    end

    def import_stats(new_monster, monster)
      new_monster.armor_class = monster[:armor_class]
      new_monster.charisma = monster[:charisma]
      new_monster.constitution = monster[:constitution]
      new_monster.dexterity = monster[:dexterity]
      new_monster.hit_points = monster[:hit_points]
      new_monster.intelligence = monster[:intelligence]
      new_monster.strength = monster[:strength]
      new_monster.wisdom = monster[:wisdom]
      new_monster.hit_dice = monster[:hit_dice] || ''
    end

    def import_profs(new_monster, monster)
      new_monster.monster_proficiencies.delete_all
      if monster[:proficiencies] && monster[:proficiencies].is_a?(Array)
        monster[:proficiencies].each do |prof|
          new_prof = Prof.find_by(name: prof[:proficiency][:name])
          new_monster_prof = MonsterProficiency.create(
            value: prof[:value]
          )
          new_monster_prof.prof = new_prof
          new_monster.monster_proficiencies << new_monster_prof
        end
      end
    end

    def import_condition_immunities(new_monster, monster)
      new_monster.condition_immunities.delete_all
      if monster[:condition_immunities] && monster[:condition_immunities].is_a?(Array)
        monster[:condition_immunities].each do |cond_imm|
          new_cond = Condition.find_by(index: cond_imm[:index])
          new_cond_imm = ConditionImmunity.create()
          new_cond_imm.condition = new_cond
          new_monster.condition_immunities << new_cond_imm
        end
      end
    end
  end
end