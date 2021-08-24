# frozen_string_literal: true
#
json.count @races.count
json.results do
  json.array! @races, partial: "admin/v1/races/race", as: :race
end
