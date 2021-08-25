# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! monster, :id,
              :alignment,
              :armor_class,
              :challenge_rating,
              :charisma,
              :charisma_save,
              :condition_immunities,
              :constitution,
              :constitution_save,
              :damage_immunities,
              :damage_resistances,
              :damage_vulnerabilities,
              :dexterity,
              :dexterity_save,
              :hit_dice_modifier,
              :hit_dice_number,
              :hit_dice_value,
              :hit_points,
              :initiative,
              :intelligence,
              :intelligence_save,
              :languages,
              :legendary_description,
              :monster_subtype,
              :monster_type,
              :name,
              :reactions,
              :senses,
              :size,
              :slug,
              :strength,
              :strength_save,
              :wisdom_save,
              :wisdom,
              :speed,
              :user_id

json.descriptionText monster.description_text
json.hit_dice monster.hit_dice
json.xp monster.xp

json.url v1_monster_url(monster, format: :json)
