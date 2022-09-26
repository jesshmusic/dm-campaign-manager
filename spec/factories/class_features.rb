# == Schema Information
#
# Table name: class_features
#
#  id                 :bigint           not null, primary key
#  desc               :string           default([]), is an Array
#  level              :integer
#  name               :string
#  reference          :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  dnd_class_level_id :bigint           not null
#
# Indexes
#
#  index_class_features_on_dnd_class_level_id  (dnd_class_level_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_level_id => dnd_class_levels.id)
#
FactoryBot.define do
  factory :class_feature do
    desc { "MyString" }
    level { 1 }
    name { "MyString" }
    reference { "MyString" }
    dnd_class_level { nil }
  end
end
