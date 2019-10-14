# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! character, :id, :name, :alignment, :proficiency, :slug, :race_id, :role,
              :type, :xp, :armor_class, :strength, :dexterity, :constitution, :intelligence,
              :wisdom, :charisma, :hit_points, :hit_points_current, :status

json.total_level character.total_level
json.hit_dice character.hit_dice
json.classes character.classes
json.race character.race.name

json.character_classes character.character_classes do |character_class|
  json.dnd_class character_class.dnd_class.name
  json.level character_class.level
  json.spell_ability character_class.dnd_class.spell_ability
  json.spell_save_dc character_class.spell_save_dc
  json.spell_attack_bonus character_class.spell_attack_bonus
end

if character.type == 'NonPlayerCharacter'
  json.challenge_rating character.challenge_rating
  json.description_text character.description_text
  json.label "#{character.name}: Role \"#{character.role}\" - #{character.classes}"
else
  json.label "#{character.name}: #{character.classes}"
end

json.value character.id
