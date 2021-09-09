# == Schema Information
#
# Table name: equipment
#
#  id                           :bigint           not null, primary key
#  name                         :string
#  quantity                     :integer
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  dnd_class_id                 :bigint
#  starting_equipment_option_id :bigint
#
# Indexes
#
#  index_equipment_on_dnd_class_id                  (dnd_class_id)
#  index_equipment_on_starting_equipment_option_id  (starting_equipment_option_id)
#
class Equipment < ApplicationRecord
  belongs_to :dnd_class, optional: true
  belongs_to :starting_equipment_option, optional: true
end
