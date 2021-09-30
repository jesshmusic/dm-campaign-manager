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

json.speeds monster.speeds do |speed|
  json.extract! speed, :name, :value
end

json.senses monster.senses do |sense|
  json.extract! sense, :name, :value
end

json.damage_resistances monster.resistances

json.damage_vulnerabilities monster.vulnerabilities

json.damage_immunities monster.immunities

json.condition_immunities monster.condition_immunities do |cond_imm|
  json.extract! cond_imm.condition, :name, :index, :description
end

json.monster_proficiencies monster.monster_proficiencies do |monster_prof|
  json.extract! monster_prof.prof, :name, :prof_type
  json.value monster_prof.value
end

json.actions monster.actions do |action|
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
