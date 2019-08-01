# == Schema Information
#
# Table name: spell_classes
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  dnd_class_id :bigint
#  spell_id     :bigint
#
# Indexes
#
#  index_spell_classes_on_dnd_class_id  (dnd_class_id)
#  index_spell_classes_on_spell_id      (spell_id)
#

class SpellClass < ApplicationRecord
  belongs_to :spell
  belongs_to :dnd_class
end
