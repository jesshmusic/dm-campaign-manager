# == Schema Information
#
# Table name: actions
#
#  id              :bigint           not null, primary key
#  attack_bonus    :integer
#  dc_ability      :string
#  dc_success_type :string
#  dc_value        :integer
#  desc            :string
#  name            :string
#  type            :string
#  usage_dice      :string
#  usage_min_value :integer
#  usage_type      :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  monster_id      :bigint           not null
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
  factory :special_ability do
    attack_bonus { %w(1 2 3 4 5 6 7 8 9 10).sample }
    dc_type { [nil, 'CON', 'STR', 'DEX'].sample }
    dc_value { [nil, 15, 18, 12].sample }
    desc { Faker::Games::Witcher.quote }
    name { Faker::Games::ElderScrolls.weapon }

    after(:create) do |action|
      create_list(:action_damage, rand(1..3), special_ability: action)
    end
  end
end
