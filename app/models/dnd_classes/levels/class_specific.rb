# == Schema Information
#
# Table name: class_specifics
#
#  id                 :bigint           not null, primary key
#  index              :string
#  name               :string
#  value              :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  dnd_class_level_id :bigint           not null
#
# Indexes
#
#  index_class_specifics_on_dnd_class_level_id  (dnd_class_level_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_level_id => dnd_class_levels.id)
#
class ClassSpecific < ApplicationRecord
  belongs_to :dnd_class_level
  has_many :class_specific_spell_slots, dependent: :destroy

  accepts_nested_attributes_for :class_specific_spell_slots, reject_if: :all_blank, allow_destroy: true
end
