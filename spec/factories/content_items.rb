# == Schema Information
#
# Table name: content_items
#
#  id         :bigint           not null, primary key
#  index      :string           not null
#  name       :string           not null
#  quantity   :integer          default(1)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  item_id    :bigint           not null
#
# Indexes
#
#  index_content_items_on_item_id  (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.id)
#
FactoryBot.define do
  factory :content_item do
    item { nil }
    content_item { nil }
  end
end
