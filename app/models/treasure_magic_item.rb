# == Schema Information
#
# Table name: treasure_magic_items
#
#  id            :bigint           not null, primary key
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  magic_item_id :bigint
#  treasure_id   :bigint
#
# Indexes
#
#  index_treasure_magic_items_on_magic_item_id  (magic_item_id)
#  index_treasure_magic_items_on_treasure_id    (treasure_id)
#

class TreasureMagicItem < ApplicationRecord
  belongs_to :treasure
  belongs_to :magic_item
end
