# frozen_string_literal: true

json.array! @items, partial: 'admin/v1/items/item', as: :item
