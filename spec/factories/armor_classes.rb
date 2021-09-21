# == Schema Information
#
# Table name: armor_classes
#
#  id            :bigint           not null, primary key
#  ac_base       :integer
#  has_dex_bonus :boolean
#  max_dex_bonus :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  item_id       :bigint           not null
#
# Indexes
#
#  index_armor_classes_on_item_id  (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.id)
#
FactoryBot.define do
  factory :armor_class do
    ac_base { 1 }
    has_dex_bonus { false }
    max_dex_bonus { 1 }
    item { nil }
  end
end
