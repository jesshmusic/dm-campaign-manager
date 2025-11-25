# frozen_string_literal: true

json.count @races.count
json.results do
  json.array! @races, partial: 'admin/v1/races/race', as: :race
  # json.array! @races, partial: 'admin/v1/races/race_summary', as: :race
end
