# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! race, :id, :name, :speed, :strength_modifier, :dexterity_modifier,
              :constitution_modifier, :intelligence_modifier, :wisdom_modifier, :charisma_modifier,
              :age, :alignment, :language_choices, :language_description, :languages,
              :size, :size_description, :starting_languages, :subraces, :traits, :slug, :user_id

json.proficiencies race.profs do |prof|
  json.extract! prof, :name, :prof_type
end