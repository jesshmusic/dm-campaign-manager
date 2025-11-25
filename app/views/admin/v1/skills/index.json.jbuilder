# frozen_string_literal: true

json.count @skills.count
json.results do
  json.array! @skills, partial: 'admin/v1/skills/skill_summary', as: :skill
end
