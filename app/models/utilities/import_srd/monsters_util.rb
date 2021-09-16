class ImportSrd::MonstersUtil
  class << self
    def dnd_api_url
      ImportSrdUtilities.dnd_api_url
    end

    def dnd_open5e_url
      ImportSrdUtilities.dnd_open5e_url
    end

    def import_monsters
      next_uri = URI("#{dnd_api_url}/api/monsters/")
      count = 0
      while next_uri
        response = Net::HTTP.get(next_uri)
        result = JSON.parse response, symbolize_names: true
        next_uri = result[:next] ? URI(result[:next]) : false
        result[:results].each do |monster_ref|
          # monster_ref = result[:results].first
          monster_uri = URI("#{dnd_api_url}#{monster_ref[:url]}")
          monster_response = Net::HTTP.get(monster_uri)
          monster = JSON.parse monster_response, symbolize_names: true
          new_monster = Monster.find_or_initialize_by(name: monster[:name])

          # Required Fields
          new_monster.slug = new_monster.slug || monster[:index]
          new_monster.alignment = monster[:alignment] || "unaligned"
          new_monster.challenge_rating = DndRules.cr_num_to_string(monster[:challenge_rating])
          new_monster.monster_type = monster[:type]
          new_monster.save!

          new_monster.api_url = "/v1/monsters/#{new_monster.slug}"
          new_monster.damage_immunities = monster[:damage_immunities]
          new_monster.damage_resistances = monster[:damage_resistances]
          new_monster.damage_vulnerabilities = monster[:damage_vulnerabilities]
          new_monster.languages = monster[:languages]
          new_monster.size = monster[:size]
          new_monster.monster_subtype = monster[:subtype] || ""
          new_monster.speed = {
            burrow: monster[:speed][:burrow] ? monster[:speed][:burrow] : "",
            climb: monster[:speed][:climb] ? monster[:speed][:climb] : "",
            fly: monster[:speed][:fly] ? monster[:speed][:fly] : "",
            hover: monster[:speed][:hover] ? monster[:speed][:hover] : false,
            swim: monster[:speed][:swim] ? monster[:speed][:swim] : "",
            walk: monster[:speed][:walk] ? monster[:speed][:walk] : "",
          }
          new_monster.senses = monster[:senses]

          # Statistics
          new_monster.armor_class = monster[:armor_class]
          new_monster.charisma = monster[:charisma]
          new_monster.constitution = monster[:constitution]
          new_monster.dexterity = monster[:dexterity]
          new_monster.hit_points = monster[:hit_points]
          new_monster.intelligence = monster[:intelligence]
          new_monster.strength = monster[:strength]
          new_monster.wisdom = monster[:wisdom]
          new_monster.hit_dice = monster[:hit_dice] || ""

          # Actions
          new_monster.actions = monster[:actions] || []
          new_monster.legendary_actions = monster[:legendary_actions] || []
          new_monster.special_abilities = monster[:special_abilities] || []
          new_monster.reactions = monster[:reactions] || []

          # Proficiencies
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

          # Condition Immunities
          new_monster.condition_immunities.delete_all
          if monster[:condition_immunities] && monster[:condition_immunities].is_a?(Array)
            monster[:condition_immunities].each do |cond_imm|
              new_cond = Condition.find_by(index: cond_imm[:index])
              new_cond_imm = ConditionImmunity.create()
              new_cond_imm.condition = new_cond
              new_monster.condition_immunities << new_cond_imm
            end
          end

          new_monster.save!
          count += 1
        end
      end
      puts "#{count} monsters imported and updated or created."
    end
  end
end