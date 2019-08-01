# == Schema Information
#
# Table name: proficiency_classes
#
#  id             :bigint           not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  dnd_class_id   :bigint
#  proficiency_id :bigint
#
# Indexes
#
#  index_proficiency_classes_on_dnd_class_id    (dnd_class_id)
#  index_proficiency_classes_on_proficiency_id  (proficiency_id)
#

class ProficiencyClass < ApplicationRecord
  belongs_to :proficiency
  belongs_to :dnd_class
end
