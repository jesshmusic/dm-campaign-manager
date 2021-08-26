# == Schema Information
#
# Table name: reactions
#
#  id         :bigint           not null, primary key
#  desc       :string
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint
#
# Indexes
#
#  index_reactions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
FactoryBot.define do
  factory :reaction do
    name { "MyString" }
    desc { "MyString" }
    monster { nil }
  end
end
