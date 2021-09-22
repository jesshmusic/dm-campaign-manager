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
        current_race.slug = race_result[:index]
        if race_result[:ability_bonus_options]
          current_race.ability_bonus_options = race_result[:ability_bonus_options][:choose]
          race_result[:ability_bonus_options][:from].each do |bonus_option|
            current_race.ability_bonus_option_choices << "#{bonus_option[:ability_score][:name]}: #{bonus_option[:bonus]}"
          end
        end
        current_race.age = race_result[:age]
        current_race.alignment = race_result[:alignment]
        race_result[:ability_bonuses].each do |bonus|
          current_race.charisma_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "CHA"
          current_race.constitution_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "CON"
          current_race.dexterity_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "DEX"
          current_race.intelligence_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "INT"
          current_race.strength_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "STR"
          current_race.wisdom_modifier = bonus[:bonus] if bonus[:ability_score][:name] == "WIS"
        end
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
        if race_result[:traits]
          race_result[:traits].each do |trait|
            trait_uri = URI("#{dnd_api_url}#{trait[:url]}")
            trait_response = Net::HTTP.get(trait_uri)
            trait_result = JSON.parse trait_response, symbolize_names: true
            current_race.traits << {
              description: trait_result[:desc],
              name: trait_result[:name],
              proficiencies: trait_result[:proficiencies],
              proficiency_choices: trait_result[:proficiency_choices],
              trait_specific: trait_result[:trait_specific]
            }
          end
        end
        current_race.save!
        count += 1
      end
      puts "#{count} Races imported or updated."
    end
  end
end