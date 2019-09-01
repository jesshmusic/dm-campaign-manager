# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! character, :id, :name, :alignment, :proficiency, :slug, :race, :role,
              :type, :xp, :armor_class, :strength, :dexterity, :constitution, :intelligence,
              :wisdom, :charisma, :hit_points

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

json.url v1_character_url(character, format: :json)
