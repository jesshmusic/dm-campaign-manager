# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! character, :id, :name, :alignment, :slug, :background,
              :copper_pieces, :description, :electrum_pieces, :gold_pieces, :languages,
              :level, :platinum_pieces, :race, :role, :silver_pieces, :spell_ability,
              :spell_attack_bonus, :spell_save_dc, :type, :xp

json.partial! 'admin/v1/stat_blocks/stat_block', stat_block: character.stat_block

json.spells_level_one

json.url v1_character_url(character, format: :json)
