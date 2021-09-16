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

unless dnd_class.spell_casting.nil?
  json.spell_casting do
    json.extract! dnd_class.spell_casting, :level
    json.spell_casting_ability dnd_class.spell_casting.ability_score.full_name
    json.info dnd_class.spell_casting.spell_casting_infos do |info|
      json.extract! info, :name, :desc
    end
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

json.levels dnd_class.dnd_class_levels do |level|
  json.extract! level, :level, :ability_score_bonuses, :prof_bonus
  json.features level.class_features do |feature|
    json.extract! feature, :name, :desc, :reference
    unless feature.prerequisites.nil?
      json.prerequisites feature.prerequisites do |prereq|
        json.extract! prereq, :name, :level
      end
    end
    json.choice do
      json.extract! feature.class_level_choice, :choices, :num_choices unless feature.class_level_choice.nil?
    end
    json.choice do
      json.extract! feature.subfeature_options, :choices, :num_choices unless feature.subfeature_options.nil?
    end
    json.choice do
      json.extract! feature.expertise_options, :choices, :num_choices unless feature.expertise_options.nil?
    end
  end
  json.class_specific do
    json.merge! level.class_specific.as_json.reject { |key, value| value.nil? || key.in?(%w[id created_at dnd_class_level_id updated_at]) }
    json.sneak_attack do
      json.extract! level.class_specific.sneak_attack, :dice_count, :dice_value unless level.class_specific.sneak_attack.nil?
    end
    json.martial_arts do
      json.extract! level.class_specific.martial_art, :dice_count, :dice_value unless level.class_specific.martial_art.nil?
    end
  end
  json.spellcasting do
    json.merge! level.class_spellcasting.attributes.reject { |key, value| value.nil? || key.in?(%w[id created_at dnd_class_level_id updated_at]) } unless level.class_spellcasting.nil?
  end
end

json.url v1_dnd_class_url(dnd_class, format: :json)
