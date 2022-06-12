# == Schema Information
#
# Table name: actions
#
#  widgetId         :bigint           not null, primary key
#  desc       :string
#  name       :string
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint
#
# Indexes
#
#  index_actions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.widgetId)
#

FactoryBot.define do
  factory :action do
    desc { Faker::Games::Witcher.quote }
    name { Faker::Games::ElderScrolls.weapon }
  end
end
