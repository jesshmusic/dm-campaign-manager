# frozen_string_literal: true

# == Schema Information
#
# Table name: equipment_items
#
#  id           :bigint           not null, primary key
#  quantity     :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#
# Indexes
#
#  index_equipment_items_on_character_id  (character_id)
#

class EquipmentItem < ApplicationRecord
  validates :quantity, presence: true

  has_many :equipment_item_items, dependent: :destroy
  has_many :items, through: :equipment_item_items

  belongs_to :character, optional: true
end
