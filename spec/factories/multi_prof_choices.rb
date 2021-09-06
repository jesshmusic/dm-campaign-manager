# == Schema Information
#
# Table name: multi_prof_choices
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  multi_classing_id :bigint           not null
#  prof_id           :bigint           not null
#
# Indexes
#
#  index_multi_prof_choices_on_multi_classing_id  (multi_classing_id)
#  index_multi_prof_choices_on_prof_id            (prof_id)
#
# Foreign Keys
#
#  fk_rails_...  (multi_classing_id => multi_classings.id)
#  fk_rails_...  (prof_id => profs.id)
#
FactoryBot.define do
  factory :multi_prof_choice do
    prof { nil }
    multi_classing { nil }
  end
end
