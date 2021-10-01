# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! monster, :id,
              :name,
              :slug,
              :monster_type,
              :monster_subtype,
              :size,
              :challenge_rating,
              :xp,
              :hit_dice,
              :hit_points,
              :alignment,
              :armor_class,
              :attack_bonus,
              :prof_bonus,
              :save_dc,
              :languages,
              :strength,
              :dexterity,
              :constitution,
              :intelligence,
              :wisdom,
              :charisma,
              :user_id,
              :api_url

json.hit_points_string monster.hit_points_string

json.challenge_string monster.challenge_string

json.speeds monster.speeds_array

json.senses monster.senses_array

json.damage_resistances monster.resistances

json.damage_vulnerabilities monster.vulnerabilities

json.damage_immunities monster.immunities

json.condition_immunities monster.condition_immunities_array

json.monster_proficiencies monster.monster_proficiencies do |monster_prof|
  json.extract! monster_prof.prof, :name, :prof_type
  json.value monster_prof.value
end

json.saving_throws monster.saving_throws
json.skills monster.skills

json.actions monster.monster_actions do |action|
  json.extract! action, :name, :desc
end

json.legendary_actions monster.legendary_actions do |action|
  json.extract! action, :name, :desc
end

json.reactions monster.reactions do |action|
  json.extract! action, :name, :desc
end

json.special_abilities monster.special_abilities do |action|
  json.extract! action, :name, :desc
end

json.url v1_monster_url(monster, format: :json)
