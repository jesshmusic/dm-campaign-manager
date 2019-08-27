# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! monster, :id, :alignment, :challenge_rating, :charisma_save,
              :condition_immunities, :constitution_save, :damage_immunities, :damage_resistances,
              :damage_vulnerabilities, :dexterity_save, :intelligence_save, :languages,
              :legendary_description, :monster_subtype, :monster_type, :name, :reactions,
              :senses, :size, :slug, :strength_save, :wisdom_save
json.descriptionText monster.description_text

json.partial! 'admin/v1/stat_blocks/stat_block', stat_block: monster.stat_block

json.url v1_monster_url(monster, format: :json)
