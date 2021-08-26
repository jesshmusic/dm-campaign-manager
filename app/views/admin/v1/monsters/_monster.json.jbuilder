# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! monster, :id,
              :actions,
              :alignment,
              :api_url,
              :armor_class,
              :challenge_rating,
              :charisma,
              :constitution,
              :damage_immunities,
              :damage_resistances,
              :damage_vulnerabilities,
              :dexterity,
              :hit_dice,
              :hit_points,
              :intelligence,
              :languages,
              :legendary_actions,
              :monster_subtype,
              :monster_type,
              :name,
              :reactions,
              :senses,
              :size,
              :slug,
              :special_abilities,
              :strength,
              :wisdom,
              :speed,
              :user_id

json.condition_immunities monster.condition_immunities do |cond_imm|
  json.extract! cond_imm.condition, :name, :index, :description
end

json.xp monster.xp

json.url v1_monster_url(monster, format: :json)
