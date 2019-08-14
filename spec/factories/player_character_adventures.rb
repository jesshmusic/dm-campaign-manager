# == Schema Information
#
# Table name: player_character_adventures
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  adventure_id :bigint
#  character_id :bigint
#
# Indexes
#
#  index_player_character_adventures_on_adventure_id  (adventure_id)
#  index_player_character_adventures_on_character_id  (character_id)
#
# Foreign Keys
#
#  fk_rails_...  (adventure_id => adventures.id)
#  fk_rails_...  (character_id => characters.id)
#

FactoryBot.define do
  factory :player_character_adventure do
    adventure { nil }
    character { nil }
  end
end
