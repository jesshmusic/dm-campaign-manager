# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! monster, :id,
              :alignment,
              :api_url,
              :armor_class,
              :attack_bonus,
              :challenge_rating,
              :charisma,
              :constitution,
              :dexterity,
              :hit_dice,
              :hit_points,
              :intelligence,
              :languages,
              :legendary_description,
              :monster_subtype,
              :monster_type,
              :name,
              :size,
              :slug,
              :strength,
              :wisdom,
              :user_id,
              :xp

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
  json.extract! action, :attack_bonus, :dc_type, :dc_value, :desc, :name, :success_type, :usage_dice, :usage_min_value, :usage_type
  unless action.action_damages.nil?
    json.damage action.action_damages do |damage|
      json.extract! damage, :damage_bonus, :damage_type, :dice_count, :dice_value
    end
  end
end

json.legendary_actions monster.legendary_actions do |action|
  json.extract! action, :attack_bonus, :dc_type, :dc_value, :desc, :name, :success_type, :usage_dice, :usage_min_value, :usage_type
  unless action.action_damages.nil?
    json.damage action.action_damages do |damage|
      json.extract! damage, :damage_bonus, :damage_type, :dice_count, :dice_value
    end
  end
end

json.reactions monster.reactions do |action|
  json.extract! action, :attack_bonus, :dc_type, :dc_value, :desc, :name, :success_type, :usage_dice, :usage_min_value, :usage_type
  unless action.action_damages.nil?
    json.damage action.action_damages do |damage|
      json.extract! damage, :damage_bonus, :damage_type, :dice_count, :dice_value
    end
  end
end

json.special_abilities monster.special_abilities do |action|
  json.extract! action, :attack_bonus, :dc_type, :dc_value, :desc, :name, :success_type, :usage_dice, :usage_min_value, :usage_type
  unless action.action_damages.nil?
    json.damage action.action_damages do |damage|
      json.extract! damage, :damage_bonus, :damage_type, :dice_count, :dice_value
    end
  end
end

json.url v1_monster_url(monster, format: :json)
