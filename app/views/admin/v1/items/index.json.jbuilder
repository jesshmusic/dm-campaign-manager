# frozen_string_literal: true

json.count @items.count
json.results do
  json.array! @items, partial: 'admin/v1/items/item_summary', as: :item
end
