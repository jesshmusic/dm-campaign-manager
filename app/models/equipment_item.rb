# == Schema Information
#
# Table name: equipment_items
#
#  id          :bigint           not null, primary key
#  quantity    :integer
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  treasure_id :bigint
#
# Indexes
#
#  index_equipment_items_on_treasure_id  (treasure_id)
#

class EquipmentItem < ApplicationRecord
  validates :quantity, presence: true
  
  has_many :equipment_item_items, dependent: :delete_all
  has_many :items, through: :equipment_item_items

  belongs_to :treasure, optional: true
  belongs_to :player_character, optional: true
end
