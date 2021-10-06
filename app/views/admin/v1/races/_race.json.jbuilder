# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! race, :id, :name, :speed, :age, :alignment, :language_choices, :language_description, :languages,
              :size, :size_description, :starting_languages, :subraces, :slug, :user_id

json.ability_bonus_options race.ability_bonus_options do |ability|
  json.extract! ability, :ability, :bonus
end

json.proficiencies race.profs do |prof|
  json.extract! prof, :name, :prof_type
end

json.traits race.race_traits do |trait|
  json.extract! trait, :name, :desc
end