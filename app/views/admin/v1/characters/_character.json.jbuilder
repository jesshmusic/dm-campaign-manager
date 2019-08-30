# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! character, :id, :name, :alignment, :proficiency, :slug, :background,
              :copper_pieces, :description, :electrum_pieces, :gold_pieces, :languages,
              :platinum_pieces, :race, :role, :silver_pieces, :type, :xp, :armor_class, :strength,
              :dexterity, :constitution, :intelligence, :wisdom, :charisma, :hit_points,
              :hit_points_current, :initiative, :speed

json.total_level character.total_level
json.hit_dice character.hit_dice
json.classes character.classes

json.character_classes character.character_classes do |character_class|
  json.dnd_class character_class.dnd_class.name
  json.level character_class.level
  json.spell_ability character_class.dnd_class.spell_ability
  json.spell_save_dc character_class.spell_save_dc
  json.spell_attack_bonus character_class.spell_attack_bonus
end

json.inventory character.equipment_items do |item|
  json.name item.items.first.name
  json.quantity item.quantity
  json.items item.items do |next_item|
    json.partial! 'admin/v1/items/item', item: next_item
  end
end

json.url v1_character_url(character, format: :json)
