# == Schema Information
#
# Table name: skills
#
#  id           :bigint           not null, primary key
#  name         :string
#  score        :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  monster_id   :bigint
#
# Indexes
#
#  index_skills_on_character_id  (character_id)
#  index_skills_on_monster_id    (monster_id)
#

FactoryBot.define do
  factory :skill do
    name { "MyString" }
    score { 1 }
  end
end
