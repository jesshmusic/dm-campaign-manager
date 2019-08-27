# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! item, :id, :type, :cost_unit, :cost_value, :description,
              :name, :sub_category, :rarity, :requires_attunement, :weight, :slug
json.url v1_item_url(item, format: :json)
