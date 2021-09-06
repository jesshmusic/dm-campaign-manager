# == Schema Information
#
# Table name: equipment
#
#  id                           :bigint           not null, primary key
#  name                         :string
#  quantity                     :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  dnd_class_id                 :bigint
#  starting_equipment_option_id :bigint
#
# Indexes
#
#  index_equipment_on_dnd_class_id                  (dnd_class_id)
#  index_equipment_on_starting_equipment_option_id  (starting_equipment_option_id)
#
FactoryBot.define do
  factory :equipment do
    quantity { 1 }
    name { "MyString" }
    item_slug { "MyString" }
  end
end
