# == Schema Information
#
# Table name: container_items
#
#  id              :bigint           not null, primary key
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  item_content_id :bigint
#  item_id         :bigint
#
# Indexes
#
#  index_container_items_on_item_content_id              (item_content_id)
#  index_container_items_on_item_id                      (item_id)
#  index_container_items_on_item_id_and_item_content_id  (item_id,item_content_id) UNIQUE
#

FactoryBot.define do
  factory :container_item do
    item { nil }
    item_content { nil }
  end
end
