# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! monster, :id, :alignment, :challenge_rating, :charisma_save,
              :condition_immunities, :constitution_save, :damage_immunities, :damage_resistances,
              :damage_vulnerabilities, :dexterity_save, :intelligence_save, :languages,
              :legendary_description, :monster_subtype, :monster_type, :name, :reactions,
              :senses, :size, :slug, :strength_save, :wisdom_save, :armor_class, :strength,
              :dexterity, :constitution, :intelligence, :wisdom, :charisma, :hit_dice_modifier,
              :hit_dice_number, :hit_dice_value, :hit_points, :initiative, :speed

json.descriptionText monster.description_text
json.hit_dice monster.hit_dice
json.xp monster.xp

json.url v1_monster_url(monster, format: :json)
