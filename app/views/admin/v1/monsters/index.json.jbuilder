# frozen_string_literal: true

json.count @monsters.count
json.results do
  json.array! @monsters, partial: 'admin/v1/monsters/monster_summary', as: :monster
end