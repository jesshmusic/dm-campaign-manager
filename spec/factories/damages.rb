# == Schema Information
#
# Table name: damages
#
#  widgetId          :bigint           not null, primary key
#  damage_dice :string
#  damage_type :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  item_id     :bigint           not null
#
# Indexes
#
#  index_damages_on_item_id  (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.widgetId)
#
FactoryBot.define do
  factory :damage do
    damage_type { "MyString" }
    damage_dice { "MyString" }
    item { nil }
  end
end
