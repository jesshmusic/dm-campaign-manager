# == Schema Information
#
# Table name: container_items
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  contained_item_id :bigint
#  item_id           :bigint
#
# Indexes
#
#  index_container_items_on_contained_item_id              (contained_item_id)
#  index_container_items_on_item_id                        (item_id)
#  index_container_items_on_item_id_and_contained_item_id  (item_id,contained_item_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (contained_item_id => items.id)
#  fk_rails_...  (item_id => items.id)
#

FactoryBot.define do
  factory :container_item do
    item { nil }
    item_content { nil }
  end
end
