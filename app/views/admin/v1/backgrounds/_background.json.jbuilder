json.extract! background, :id, :name, :slug, :edition, :description,
              :feat_name, :tool_proficiency,
              :equipment_option_a, :equipment_option_b,
              :homebrew, :created_at, :updated_at

json.abilityScores background.ability_scores
json.skillProficiencies background.skill_proficiencies

if background.user.present?
  json.user do
    json.id background.user.id
    json.name background.user.name
  end
end
