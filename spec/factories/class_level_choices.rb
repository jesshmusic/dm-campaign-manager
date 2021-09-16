# == Schema Information
#
# Table name: class_level_choices
#
#  id               :bigint           not null, primary key
#  choices          :string           default([]), is an Array
#  name             :string
#  num_choices      :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  class_feature_id :bigint           not null
#
# Indexes
#
#  index_class_level_choices_on_class_feature_id  (class_feature_id)
#
# Foreign Keys
#
#  fk_rails_...  (class_feature_id => class_features.id)
#
FactoryBot.define do
  factory :class_level_choice do
    dnd_class_level { nil }
    num_choices { 1 }
    name { "MyString" }
  end
end
