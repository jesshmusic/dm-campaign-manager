# == Schema Information
#
# Table name: treasure_items
#
#  id          :bigint           not null, primary key
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  item_id     :bigint
#  treasure_id :bigint
#
# Indexes
#
#  index_treasure_items_on_item_id      (item_id)
#  index_treasure_items_on_treasure_id  (treasure_id)
#

class TreasureItem < ApplicationRecord
  belongs_to :treasure
  belongs_to :item
end
