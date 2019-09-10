# == Schema Information
#
# Table name: character_races
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  race_id      :bigint
#
# Indexes
#
#  index_character_races_on_character_id  (character_id)
#  index_character_races_on_race_id       (race_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (race_id => races.id)
#

FactoryBot.define do
  factory :character_race do
    character { nil }
    race { nil }
  end
end
