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

require 'rails_helper'

RSpec.describe ProfChoiceProf, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
