# == Schema Information
#
# Table name: skills
#
#  id            :bigint           not null, primary key
#  ability_score :string
#  desc          :string
#  edition       :string           default("2014"), not null
#  name          :string
#  slug          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_skills_on_edition           (edition)
#  index_skills_on_slug_and_edition  (slug,edition) UNIQUE
#
FactoryBot.define do
  factory :skill do
    sequence(:name) { |n| "Skill #{n}" }
    desc { "A skill description" }
    ability_score { "Dexterity" }
  end
end
