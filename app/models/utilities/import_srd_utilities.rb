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
      ImportSrd::ItemsUtil.import_items
      ImportSrd::DndClassesUtil.import_classes
      ImportSrd::RacesUtil.import_races
      ImportSrd::SpellsUtil.import_spells
      ImportSrd::ItemsUtil.import_and_fix_magic_items
      ImportSrd::MonstersUtil.import_monsters
    end

    def import_all_empty(exclude)
      has_dependencies = AbilityScore.count > 0 && Prof.count > 0 && Condition.count > 0
      import_dependencies unless has_dependencies
      ImportSrd::ItemsUtil.import_items unless Item.count > 0 || exclude != :items
      # import_classes
      ImportSrd::DndClassesUtil.import_classes unless DndClass.count > 0 || exclude != :classes
      ImportSrd::RacesUtil.import_races unless Race.count > 0 || exclude != :races
      ImportSrd::SpellsUtil.import_spells unless Spell.count > 0 || exclude != :spells
      ImportSrd::ItemsUtil.import_and_fix_magic_items unless Item.count > 0 || exclude != :magic_items
      ImportSrd::MonstersUtil.import_monsters unless Monster.count > 0 || exclude != :monsters
    end

    def import_dependencies
      import_ability_scores
      import_proficiencies
      import_conditions
    end

    def import_dnd_classes
      # import_dependencies
      # import_items
      ImportSrd::DndClassesUtil.import_classes
    end

    def update_monsters
      ImportSrd::MonstersUtil.import_monsters
    end

    def clean_database
      ApiReference.destroy_all
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
    end

    def import_prof(prof_url, new_dnd_class = nil)
      prof_uri = URI("#{dnd_api_url}#{prof_url}")
      prof_response = Net::HTTP.get(prof_uri)
      prof_result = JSON.parse prof_response, symbolize_names: true
      new_prof = Prof.find_or_initialize_by(name: prof_result[:name])
      new_prof.prof_type = prof_result[:type]
      prof_result[:classes].each do |dnd_class|
        prof_class = new_dnd_class.nil? ? DndClass.find_by(name: dnd_class[:name]) : new_dnd_class
        prof_class.profs |= [new_prof] unless prof_class.nil?
      end
      prof_result[:races].each do |race|
        prof_race = Race.find_by(slug: "race-#{race[:index]}")
        prof_race.profs |= [new_prof] unless prof_race.nil?
      end
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
        # First create an ApiReference for usage elsewhere
        ApiReference.find_or_create_by(slug: ability_ref[:index], name: ability_ref[:index], api_url: "")

        # Fetch the full class record
        ability_uri = URI("#{dnd_api_url}#{ability_ref[:url]}")
        ability_response = Net::HTTP.get(ability_uri)
        ability_result = JSON.parse ability_response, symbolize_names: true

        ability_score = AbilityScore.find_or_create_by(name: ability_result[:name],
                                                       slug: ability_result[:index],
                                                       full_name: ability_result[:full_name])
        ability_score.desc = ability_result[:desc]
        ability_score.save!
        count += 1
      end
      puts "#{count} Abilities imported."
    end

    def import_proficiencies
      uri = URI("#{dnd_api_url}/api/proficiencies")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |prof|
        import_prof(prof[:url])
        count += 1
      end
      puts "#{count} Proficiencies imported or updated."
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
        new_cond = Condition.find_or_initialize_by(index: condition[:index])
        new_cond.description = condition_result[:desc]
        new_cond.name = condition_result[:name]
        new_cond.index = condition_result[:index]
        new_cond.save!
        count += 1
      end
      puts "#{count} Conditions imported or updated."
    end
  end
end
