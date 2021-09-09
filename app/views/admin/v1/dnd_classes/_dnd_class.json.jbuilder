# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! dnd_class, :api_url, :hit_die, :name,
              :slug, :subclasses, :user_id

json.ability_scores dnd_class.ability_scores do |ability_score|
  json.extract! ability_score, :desc, :full_name, :name
end

json.starting_equipment dnd_class.equipments do |equipment|
  json.extract! equipment, :name, :quantity
end

json.starting_equipment_options dnd_class.starting_equipment_options do |equip_option|
  json.extract! equip_option, :choose, :equipment_type, :equipment_category
  json.options do
    json.array! equip_option.equipments do |equipment|
      json.extract! equipment, :name, :quantity
    end
    json.array! equip_option.equipment_options do |equip_opt|
      json.equipment_option do
        json.extract! equip_opt, :choose, :equipment_type, :equipment_category
        json.options do
          equip_option.equipments do |equipment|
            json.extract! equipment, :name, :quantity
          end
        end
      end
    end
  end
end

json.proficiencies dnd_class.profs do |prof|
  json.extract! prof, :name, :prof_type
end

json.proficiency_choices dnd_class.prof_choices do |prof_choice|
  json.extract! prof_choice, :name, :num_choices, :prof_choice_type
  json.proficiencies prof_choice.profs do |prof|
    json.extract! prof, :name, :prof_type
  end
end

json.spell_casting do
  json.extract! dnd_class.spell_casting, :level
  json.spell_casting_ability dnd_class.spell_casting.ability_score.full_name
  json.info dnd_class.spell_casting.spell_casting_infos do |info|
    json.extract! info, :name, :desc
  end
end

json.multi_classing do
  json.prerequisites dnd_class.multi_classing.multi_class_prereqs do |prereq|
    json.extract! prereq, :ability_score, :minimum_score
  end
  json.proficiencies dnd_class.multi_classing.profs do |prof|
    json.extract! prof, :name, :prof_type
  end
  json.proficiency_choices dnd_class.multi_classing.prof_choices do |prof_choice|
    json.extract! prof_choice, :name, :num_choices, :prof_choice_type
    json.proficiencies prof_choice.profs do |prof|
      json.extract! prof, :name, :prof_type
    end
  end
end

json.url v1_dnd_class_url(dnd_class, format: :json)
