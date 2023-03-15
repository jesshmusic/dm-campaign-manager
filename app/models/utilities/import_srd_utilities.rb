# frozen_string_literal: true

class ImportSrdUtilities
  class << self
    def dnd_api_url
      'http://www.dnd5eapi.co'
    end

    def dnd_open5e_url
      'https://api.open5e.com/'
    end

    def import_all
      import_dependencies
      ItemsUtil.import
      MagicItemsUtil.import
      DndClassesUtil.import
      RacesUtil.import
      SpellsUtil.import
      MonstersUtil.import
      SectionsUtil.import
      RulesUtil.import
    end

    def import_all_empty(exclude)
      has_dependencies = AbilityScore.count > 0 && Prof.count > 0 && Condition.count > 0
      import_dependencies unless has_dependencies
      ItemsUtil.import unless Item.count > 0 || exclude == :items
      # import_classes
      DndClassesUtil.import unless DndClass.count > 0 || exclude == :classes
      RacesUtil.import unless Race.count > 0 || exclude == :races
      SpellsUtil.import unless Spell.count > 0 || exclude == :spells
      MonstersUtil.import unless Monster.count > 0 || exclude == :monsters
    end

    def import_dependencies
      import_ability_scores
      import_proficiencies
      import_skills
      import_conditions
    end

    def clean_database
      count = Race.count
      Race.destroy_all
      puts "All #{count} races deleted"
      count = Monster.count
      Monster.destroy_all
      puts "All #{count} monsters deleted"
      count = Item.count
      Item.destroy_all
      puts "All #{count} items deleted"
      count = MagicItem.count
      MagicItem.destroy_all
      puts "All #{count} magic items deleted"
      count = Spell.count
      Spell.destroy_all
      puts "All #{count} spells deleted"
      count = DndClass.count
      DndClass.destroy_all
      puts "All #{count} classes deleted"
      count = Prof.count
      Prof.destroy_all
      puts "All #{count} proficiencies deleted"
      AbilityScoreDndClass.destroy_all
      count = AbilityScore.count
      AbilityScore.destroy_all
      puts "All #{count} ability scores deleted"
      Condition.destroy_all
      Equipment.destroy_all
      Skill.destroy_all
      Rule.destroy_all
    end

    def import_proficiencies
      uri = URI("#{dnd_api_url}/api/proficiencies")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |prof|
        import_prof(prof[:url])
        count += 1
        puts "\tProficiency #{prof[:name]} imported."
      end
      puts "#{count} Proficiencies imported or updated."
    end

    def import_skills
      uri = URI("#{dnd_api_url}/api/skills")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |skill|
        skill_uri = URI("#{dnd_api_url}#{skill[:url]}")
        skill_response = Net::HTTP.get(skill_uri)
        skill_result = JSON.parse skill_response, symbolize_names: true
        new_skill = Skill.create!(
          name: skill_result[:name],
          desc: skill_result[:desc].join("\n"),
          ability_score: skill_result[:ability_score][:name]
        )
        count += 1
        puts "\tSkill #{new_skill.name} imported."
      end
      puts "#{count} Proficiencies imported or updated."
    end

    def import_prof(prof_url)
      prof_uri = URI("#{dnd_api_url}#{prof_url}")
      prof_response = Net::HTTP.get(prof_uri)
      prof_result = JSON.parse prof_response, symbolize_names: true
      new_prof = Prof.find_or_create_by(name: prof_result[:name])
      new_prof.prof_type = prof_result[:type]
      new_prof.save!
      new_prof
    end

    private

    def import_ability_scores
      uri = URI("#{dnd_api_url}/api/ability-scores")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |ability_ref|
        # Fetch the full class record
        ability_uri = URI("#{dnd_api_url}#{ability_ref[:url]}")
        ability_response = Net::HTTP.get(ability_uri)
        ability_result = JSON.parse ability_response, symbolize_names: true

        ability_score = AbilityScore.find_or_create_by(name: ability_result[:name],
                                                       full_name: ability_result[:full_name])
        ability_score.desc = ability_result[:desc]
        ability_score.save!
        count += 1
      end
      puts "#{count} Abilities imported."
    end

    def import_conditions
      uri = URI("#{dnd_api_url}/api/conditions")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |condition|
        condition_uri = URI("#{dnd_api_url}#{condition[:url]}")
        condition_response = Net::HTTP.get(condition_uri)
        condition_result = JSON.parse condition_response, symbolize_names: true
        new_cond = Condition.find_or_initialize_by(name: condition[:name])
        new_cond.description = condition_result[:desc]
        new_cond.save!
        count += 1
        puts "\tCondition #{new_cond.name} imported."
      end
      puts "#{count} Conditions imported or updated."
    end
  end
end
