# == Schema Information
#
# Table name: monster_immunities
#
#  id         :bigint           not null, primary key
#  name       :string
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint           not null
#
# Indexes
#
#  index_monster_immunities_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
FactoryBot.define do
  factory :damage_resistance do
    name { "MyString" }
    monster { nil }
  end
end
