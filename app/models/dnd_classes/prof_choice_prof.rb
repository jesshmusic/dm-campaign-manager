# == Schema Information
#
# Table name: prof_choice_profs
#
#  id             :bigint           not null, primary key
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  prof_choice_id :bigint
#  prof_id        :bigint
#
# Indexes
#
#  index_prof_choice_profs_on_prof_choice_id  (prof_choice_id)
#  index_prof_choice_profs_on_prof_id         (prof_id)
#

class ProfChoiceProf < ApplicationRecord
  belongs_to :prof
  belongs_to :prof_choice
end
