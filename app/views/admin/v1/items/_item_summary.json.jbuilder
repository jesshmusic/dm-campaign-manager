# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! item, :id, :type, :cost_unit, :cost_value, :description,
              :name, :sub_category, :rarity, :requires_attunement, :weight, :slug

json.contained_items item.contained_items do |next_item|
  json.extract! next_item, :id, :type, :cost_unit, :cost_value, :description,
                :name, :sub_category, :rarity, :requires_attunement, :weight, :slug
end
