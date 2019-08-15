# == Schema Information
#
# Table name: equipment_items
#
#  id           :bigint           not null, primary key
#  quantity     :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  encounter_id :bigint
#
# Indexes
#
#  index_equipment_items_on_character_id  (character_id)
#  index_equipment_items_on_encounter_id  (encounter_id)
#
# Foreign Keys
#
#  fk_rails_...  (encounter_id => encounters.id)
#

require 'rails_helper'

RSpec.describe EquipmentItem, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
