# frozen_string_literal: true

json.count @rules.nil? ? 0 : @rules.count
json.results do
  json.array! @rules, partial: 'admin/v1/rules/rule', as: :rule
end
