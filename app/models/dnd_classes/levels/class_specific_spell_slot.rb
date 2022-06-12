# == Schema Information
#
# Table name: class_specific_spell_slots
#
#  widgetId                 :bigint           not null, primary key
#  sorcery_point_cost :integer
#  spell_slot_level   :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  class_specific_id  :bigint           not null
#
# Indexes
#
#  index_class_specific_spell_slots_on_class_specific_id  (class_specific_id)
#
# Foreign Keys
#
#  fk_rails_...  (class_specific_id => class_specifics.widgetId)
#
class ClassSpecificSpellSlot < ApplicationRecord
  belongs_to :class_specific
end
