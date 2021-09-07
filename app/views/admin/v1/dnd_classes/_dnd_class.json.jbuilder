# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! dnd_class, :id, :api_url, :hit_die, :name,
              :slug, :subclasses, :user_id

json.ability_scores dnd_class.ability_scores do |ability_score|
  json.extract! ability_score, :desc, :full_name, :name
end

json.starting_equipment dnd_class.equipments do |equipment|
  json.extract! equipment, :name, :quantity
  json.extract! equipment.item, :name, :desc, :slug
end

json.starting_equipment_options dnd_class.starting_equipment_options do |equip_option|
  json.extract! equip_option, :choose, :equipment_type, :equipment_category
  json.options do
    json.array! equip_option.equipments do |equipment|
      json.equipment do
        json.item do
          json.name equipment.item.name
          json.desc equipment.item.desc
          json.slug equipment.item.slug
        end
        json.quantity equipment.quantity
      end
    end
    json.array! equip_option.equipment_options do |equip_opt|
      json.equipment_option do
        json.extract! equip_opt, :choose, :equipment_type, :equipment_category
        json.options do
          equip_option.equipments do |equipment|
            json.equipment do
              json.item do
                json.name equipment.item.name
                json.desc equipment.item.desc
                json.slug equipment.item.slug
              end
              json.quantity equipment.quantity
            end
          end
        end
      end
    end
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
