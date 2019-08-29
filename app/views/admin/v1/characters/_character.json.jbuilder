# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! character, :id, :name, :alignment, :proficiency, :slug, :background,
              :copper_pieces, :description, :electrum_pieces, :gold_pieces, :languages,
              :platinum_pieces, :race, :role, :silver_pieces, :spell_ability,
              :spell_attack_bonus, :spell_save_dc, :type, :xp

json.total_level character.total_level
json.hit_dice character.hit_dice

json.stat_block do
  json.partial! 'admin/v1/stat_blocks/stat_block', stat_block: character.stat_block
end

json.classes character.character_classes do |character_class|
  json.dnd_class character_class.dnd_class.name
  json.level character_class.level
  json.spell_ability character_class.dnd_class.spell_ability
  json.spell_save_dc character_class.spell_save_dc
  json.spell_attack_bonus character_class.spell_attack_bonus
end

json.url v1_character_url(character, format: :json)
