# == Schema Information
#
# Table name: prof_choice_classes
#
#  id             :bigint           not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  dnd_class_id   :bigint
#  prof_choice_id :bigint
#
# Indexes
#
#  index_prof_choice_classes_on_dnd_class_id    (dnd_class_id)
#  index_prof_choice_classes_on_prof_choice_id  (prof_choice_id)
#

FactoryBot.define do
  factory :prof_choice_class do
    dnd_class { "" }
    prof_choice { "" }
  end
end
