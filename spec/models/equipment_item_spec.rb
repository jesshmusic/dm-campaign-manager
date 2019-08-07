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

require 'rails_helper'

RSpec.describe EquipmentItem, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
