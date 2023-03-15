json.extract! rule, :id, :name, :description, :slug, :created_at, :updated_at

json.count rule.children.count
json.rules rule.children do |child_rule|
  json.extract! child_rule, :id, :name, :description
end