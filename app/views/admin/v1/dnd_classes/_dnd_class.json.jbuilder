# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! dnd_class, :id, :api_url, :hit_die, :name,
              :slug, :subclasses, :user_id

json.ability_scores dnd_class.ability_scores do |ability_score|
  json.extract! ability_score, :desc, :full_name, :name
end

json.starting_equipment dnd_class.equipments do |equipment|
  json.extract! equipment, :name, :quantity
  json.extract! equipment.item do |item|
    json.extract! item, :name, :desc, :slug
  end
end

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
