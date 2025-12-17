json.extract! feat, :id, :name, :slug, :edition, :category, :prerequisite,
              :description, :repeatable, :homebrew, :created_at, :updated_at

if feat.user.present?
  json.user do
    json.id feat.user.id
    json.name feat.user.name
  end
end
