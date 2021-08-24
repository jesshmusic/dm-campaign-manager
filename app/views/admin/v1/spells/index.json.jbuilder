# frozen_string_literal: true
#
json.count @spells.count
json.results do
  json.array! @spells, partial: 'admin/v1/spells/spell', as: :spell
end