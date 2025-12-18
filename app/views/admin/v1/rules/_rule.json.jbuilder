json.extract! rule, :id, :name, :description, :slug, :category, :subcategory, :sort_order, :game_icon, :created_at, :updated_at

# Build ancestors chain for breadcrumbs
ancestors = []
current = rule.parent
while current.present?
  ancestors.unshift({ name: current.name, slug: current.slug })
  current = current.parent
end
json.ancestors ancestors

json.count rule.children.count
json.rules rule.children.order(Arel.sql('COALESCE(sort_order, 999)'), :name) do |child_rule|
  json.extract! child_rule, :id, :name, :slug, :description, :subcategory, :sort_order, :game_icon
  json.count child_rule.children.count
  json.rules child_rule.children.order(Arel.sql('COALESCE(sort_order, 999)'), :name) do |grandchild|
    json.extract! grandchild, :id, :name, :slug, :description, :subcategory, :sort_order, :game_icon
  end
end
