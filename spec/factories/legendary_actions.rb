# == Schema Information
#
# Table name: actions
#
#  id         :bigint           not null, primary key
#  desc       :string
#  name       :string
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint           not null
#
# Indexes
#
#  index_actions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
FactoryBot.define do
  factory :legendary_action do
    desc { Faker::Games::Witcher.quote }
    name { Faker::Games::ElderScrolls.weapon }
  end
end
