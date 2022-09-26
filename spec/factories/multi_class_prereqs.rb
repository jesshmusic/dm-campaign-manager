# == Schema Information
#
# Table name: multi_class_prereqs
#
#  id                              :bigint           not null, primary key
#  ability_score                   :string
#  minimum_score                   :integer
#  created_at                      :datetime         not null
#  updated_at                      :datetime         not null
#  multi_classing_id               :bigint
#  multi_classing_prereq_option_id :bigint
#
# Indexes
#
#  index_multi_class_prereqs_on_multi_classing_id                (multi_classing_id)
#  index_multi_class_prereqs_on_multi_classing_prereq_option_id  (multi_classing_prereq_option_id)
#
FactoryBot.define do
  factory :multi_class_prereq do
    ability_score { "MyString" }
    minimum_score { 1 }
    multi_classing { nil }
    multi_classing_prereq_option { nil }
  end
end
