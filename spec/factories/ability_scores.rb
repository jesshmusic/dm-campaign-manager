# == Schema Information
#
# Table name: ability_scores
#
#  id         :bigint           not null, primary key
#  desc       :string           default([]), is an Array
#  full_name  :string
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
FactoryBot.define do
  factory :ability_score do
    name { "MyString" }
    full_name { "MyString" }
    desc { "MyString" }
    slug { "MyString" }
  end
end
