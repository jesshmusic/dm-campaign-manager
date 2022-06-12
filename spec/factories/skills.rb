# == Schema Information
#
# Table name: skills
#
#  widgetId            :bigint           not null, primary key
#  ability_score :string
#  desc          :string
#  name          :string
#  slug          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_skills_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :skill do
    slug { "" }
    name { "" }
    desc { "" }
    ability_score { "MyString" }
  end
end
