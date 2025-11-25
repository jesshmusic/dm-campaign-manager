# frozen_string_literal: true

json.count @conditions.count
json.results do
  json.array! @conditions, partial: 'admin/v1/conditions/condition_summary', as: :condition
end
