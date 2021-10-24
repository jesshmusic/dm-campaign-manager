# frozen_string_literal: true
#
json.count @proficiencies.count
json.results do
  json.array! @proficiencies, partial: 'admin/v1/proficiencies/proficiency_summary', as: :proficiency
end
