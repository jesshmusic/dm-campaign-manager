# == Schema Information
#
# Table name: reactions
#
#  id              :bigint           not null, primary key
#  attack_bonus    :integer
#  dc_type         :string
#  dc_value        :string
#  desc            :string
#  name            :string
#  success_type    :string
#  usage_dice      :string
#  usage_min_value :integer
#  usage_type      :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  monster_id      :bigint           not null
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
    attack_bonus { %w(1 2 3 4 5 6 7 8 9 10).sample }
    dc_type { [nil, 'CON', 'STR', 'DEX'].sample }
    dc_value { [nil, 15, 18, 12].sample }
    desc { Faker::Games::Witcher.quote }
    name { Faker::Games::ElderScrolls.weapon }

    after(:create) do |action|
      create_list(:action_damage, rand(1..3), reaction: action)
    end
  end
end
