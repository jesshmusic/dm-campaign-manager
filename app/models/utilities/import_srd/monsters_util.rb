class MonstersUtil
  class << self
    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def dnd_open5e_url
      ImportSrdUtilities.dnd_open5e_url
    end

    def import
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

    def import_required_fields(new_monster, monster)
      new_monster.slug = new_monster.slug || monster[:index]
      new_monster.alignment = monster[:alignment] || 'unaligned'
      monster_cr = DndRules.cr_num_to_string(monster[:challenge_rating])
      new_monster.challenge_rating = monster_cr
      new_monster.monster_type = monster[:type]
      new_monster.prof_bonus = DndRules.proficiency_for_cr(monster[:challenge_rating])
      new_monster.attack_bonus = new_monster.prof_bonus + DndRules.ability_score_modifier(monster[:strength])
      new_monster.save_dc = DndRules.challenge_ratings[monster_cr.to_sym][:save_dc]
      new_monster.save!
    end

    def import_info(new_monster, monster)
      new_monster.api_url = "/v1/monsters/#{new_monster.slug}"
      new_monster.languages = monster[:languages]
      new_monster.size = monster[:size]
      new_monster.monster_subtype = monster[:subtype] || ''
      new_monster.xp = monster[:xp]
    end

    def import_damage_immunities(new_monster, monster)
      new_monster.damage_immunities.destroy_all unless new_monster.damage_immunities.nil?
      unless monster[:damage_immunities].nil?
        monster[:damage_immunities].each do |damage|
          new_monster.damage_immunities.create(name: damage)
        end
      end
    end

    def import_damage_resistances(new_monster, monster)
      new_monster.damage_resistances.destroy_all unless new_monster.damage_resistances.nil?
      unless monster[:damage_resistances].nil?
        monster[:damage_resistances].each do |damage|
          new_monster.damage_resistances.create(name: damage)
        end
      end
    end

    def import_damage_vulnerabilities(new_monster, monster)
      new_monster.damage_vulnerabilities.destroy_all unless new_monster.damage_vulnerabilities.nil?
      unless monster[:damage_vulnerabilities].nil?
        monster[:damage_vulnerabilities].each do |damage|
          new_monster.damage_vulnerabilities.create(name: damage)
        end
      end
    end

    def import_speeds(new_monster, monster)
      new_monster.speeds.destroy_all unless new_monster.speeds.nil?
      unless monster[:speed].nil?
        monster[:speed].each_key do |key|
          value = monster[:speed][key] == true ? 1 : monster[:speed][key].to_i
          new_monster.speeds.create(name: key.to_s.titleize, value: value)
        end
      end
    end

    def import_senses(new_monster, monster)
      new_monster.senses.destroy_all unless new_monster.senses.nil?
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

    def import_actions(new_monster, monster)
      new_monster.actions.destroy_all unless new_monster.actions.nil?
      attack_bonuses = []
      unless monster[:actions].nil?
        monster[:actions].each do |action|
          new_monster.actions.create(name: action[:name], desc: action[:desc])
          attack_bonuses << action[:attack_bonus] unless action[:attack_bonus].nil?
        end
      end
      raw_at_bonus = attack_bonuses.sum / attack_bonuses.size.to_f unless attack_bonuses.empty?
      new_monster.attack_bonus = raw_at_bonus.ceil unless raw_at_bonus.nil?
    end

    def import_legendary_actions(new_monster, monster)
      new_monster.legendary_actions.destroy_all unless new_monster.legendary_actions.nil?
      unless monster[:legendary_actions].nil?
        monster[:legendary_actions].each do |action|
          new_monster.legendary_actions.create(name: action[:name], desc: action[:desc])
        end
      end
    end

    def import_reactions(new_monster, monster)
      new_monster.reactions.destroy_all unless new_monster.reactions.nil?
      unless monster[:reactions].nil?
        monster[:reactions].each do |action|
          new_monster.reactions.create(name: action[:name], desc: action[:desc])
        end
      end
    end

    def import_special_abilities(new_monster, monster)
      new_monster.special_abilities.destroy_all unless new_monster.special_abilities.nil?
      unless monster[:special_abilities].nil?
        monster[:special_abilities].each do |action|
          new_monster.special_abilities.create(name: action[:name], desc: action[:desc])
        end
      end
    end

    def import_profs(new_monster, monster)
      new_monster.monster_proficiencies.destroy_all unless new_monster.monster_proficiencies.nil?
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
      new_monster.condition_immunities.destroy_all unless new_monster.condition_immunities.nil?
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