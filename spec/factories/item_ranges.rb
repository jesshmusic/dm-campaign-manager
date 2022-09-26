# == Schema Information
#
# Table name: item_ranges
#
#  id         :bigint           not null, primary key
#  long       :integer
#  normal     :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  item_id    :bigint           not null
#
# Indexes
#
#  index_item_ranges_on_item_id  (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.id)
#
FactoryBot.define do
  factory :item_range do
    long { 1 }
    normal { 1 }
    item { nil }
  end
end
