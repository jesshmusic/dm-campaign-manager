# == Schema Information
#
# Table name: equipment_item_items
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  equipment_item_id :bigint
#  item_id           :bigint
#
# Indexes
#
#  index_equipment_item_items_on_equipment_item_id  (equipment_item_id)
#  index_equipment_item_items_on_item_id            (item_id)
#

FactoryBot.define do
  factory :equipment_item_item do
    
  end
end
