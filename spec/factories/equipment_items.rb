# == Schema Information
#
# Table name: equipment_items
#
#  id          :bigint           not null, primary key
#  quantity    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  treasure_id :bigint
#
# Indexes
#
#  index_equipment_items_on_treasure_id  (treasure_id)
#

FactoryBot.define do
  factory :equipment_item do
    quantity { 1 }
    item { "" }
  end
end
