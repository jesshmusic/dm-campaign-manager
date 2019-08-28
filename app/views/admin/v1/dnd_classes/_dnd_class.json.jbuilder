# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! dnd_class, :id, :name, :hit_die,
              :slug, :user_id, :spell_ability, :primary_abilities,
              :saving_throw_abilities

json.proficiencies dnd_class.profs do |prof|
  json.extract! prof, :id, :name, :prof_type
end

json.proficiency_choices dnd_class.prof_choices do |prof_choice|
  json.extract! prof_choice, :id, :name, :num_choices, :prof_choice_type
  json.proficiencies prof_choice.profs do |prof|
    json.extract! prof, :id, :name, :prof_type
  end
end
json.url v1_dnd_class_url(dnd_class, format: :json)
