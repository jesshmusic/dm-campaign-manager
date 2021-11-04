class RacesUtil
  class << self
    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def dnd_open5e_url
      ImportSrdUtilities.dnd_open5e_url
    end

    def import
      uri = URI("#{dnd_api_url}/api/races")
      response = Net::HTTP.get(uri)
      result = JSON.parse response, symbolize_names: true
      count = 0
      result[:results].each do |race|
        race_uri = URI("#{dnd_api_url}#{race[:url]}")
        race_response = Net::HTTP.get(race_uri)
        race_result = JSON.parse race_response, symbolize_names: true
        current_race = Race.find_or_initialize_by(name: race[:name])

        current_race.age = race_result[:age]
        current_race.alignment = race_result[:alignment]
        if race_result[:language_options]
          current_race.starting_languages = race_result[:language_options][:choose]
          race_result[:language_options][:from].each do |option|
            current_race.language_choices << option[:name]
          end
        end
        current_race.language_description = race_result[:language_desc]
        race_result[:languages].each do |language|
          current_race.languages << language[:name]
        end
        current_race.size = race_result[:size]
        current_race.size_description = race_result[:size_description]
        current_race.speed = race_result[:speed]
        current_race.subraces = race_result[:subraces] ? race_result[:subraces] : []
        current_race.save!
        import_abilities(current_race, race_result)
        import_traits(current_race, race_result)
        puts "\tRace #{current_race.name} imported"
        count += 1
      end
      puts "#{count} Races imported or updated."
    end

    private

    def ability_score_name(ability)
      case ability
      when 'STR'
        'strength'
      when 'DEX'
        'dexterity'
      when 'CON'
        'constitution'
      when 'INT'
        'intelligence'
      when 'WIS'
        'wisdom'
      when 'CHA'
        'charisma'
      else
        'strength'
      end
    end

    def import_abilities(race, race_result)
      if race_result[:ability_bonuses]
        race_result[:ability_bonuses].each do |ability|
          race.ability_bonus_options.create(ability: ability_score_name(ability[:ability_score][:name]), bonus: ability[:bonus])
        end
        race.save!
      end
    end

    def import_traits(race, race_result)
      if race_result[:traits]
        race_result[:traits].each do |trait|
          trait_uri = URI("#{dnd_api_url}#{trait[:url]}")
          trait_response = Net::HTTP.get(trait_uri)
          trait_result = JSON.parse trait_response, symbolize_names: true
          race.race_traits.create(name: trait_result[:name], desc: trait_result[:desc])
        end
        race.save!
      end
    end
  end
end