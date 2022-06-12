# == Schema Information
#
# Table name: prof_choice_profs
#
#  widgetId             :bigint           not null, primary key
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

FactoryBot.define do
  factory :prof_choice_prof do
    prof { "" }
    prof_choice { "" }
  end
end
