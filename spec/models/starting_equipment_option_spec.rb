# == Schema Information
#
# Table name: starting_equipment_options
#
#  id             :bigint           not null, primary key
#  choose         :integer
#  equipment_type :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  dnd_class_id   :bigint           not null
#
# Indexes
#
#  index_starting_equipment_options_on_dnd_class_id  (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#
require 'rails_helper'

RSpec.describe StartingEquipmentOption, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
