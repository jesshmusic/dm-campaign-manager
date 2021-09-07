# == Schema Information
#
# Table name: starting_equipment_options
#
#  id                  :bigint           not null, primary key
#  choose              :integer
#  equipment_category  :string
#  equipment_type      :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  dnd_class_id        :bigint
#  equipment_option_id :bigint
#
# Indexes
#
#  index_starting_equipment_options_on_dnd_class_id         (dnd_class_id)
#  index_starting_equipment_options_on_equipment_option_id  (equipment_option_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#  fk_rails_...  (equipment_option_id => starting_equipment_options.id)
#
FactoryBot.define do
  factory :starting_equipment_option do
    quantity { 1 }
    name { "" }
    slug { "MyString" }
  end
end
