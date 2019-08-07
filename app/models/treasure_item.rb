# == Schema Information
#
# Table name: treasure_items
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  equipment_item_id :bigint
#  treasure_id       :bigint
#
# Indexes
#
#  index_treasure_items_on_equipment_item_id  (equipment_item_id)
#  index_treasure_items_on_treasure_id        (treasure_id)
#

class TreasureItem < ApplicationRecord
  belongs_to :treasure
  belongs_to :equipment_item
end
