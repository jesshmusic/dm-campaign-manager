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

require 'rails_helper'

RSpec.describe ProfChoiceClass, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
