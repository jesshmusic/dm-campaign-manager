# == Schema Information
#
# Table name: equipment_items
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  equipment_id :bigint           not null
#  item_id      :bigint           not null
#
# Indexes
#
#  index_equipment_items_on_equipment_id  (equipment_id)
#  index_equipment_items_on_item_id       (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (equipment_id => equipment.id)
#  fk_rails_...  (item_id => items.id)
#
FactoryBot.define do
  factory :equipment_item do
    equipment { nil }
    item { nil }
  end
end
