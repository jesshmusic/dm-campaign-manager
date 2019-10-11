# == Schema Information
#
# Table name: encounter_npcs
#
#  id           :bigint           not null, primary key
#  is_combatant :boolean          default(FALSE), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  encounter_id :bigint
#
# Indexes
#
#  index_encounter_npcs_on_character_id  (character_id)
#  index_encounter_npcs_on_encounter_id  (encounter_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (encounter_id => encounters.id)
#

FactoryBot.define do
  factory :encounter_npc do
    before(:create) do |encounter_npc|
      campaign = encounter_npc.encounter.adventure.campaign
      encounter_npc.character = FactoryBot.create(:non_player_character, campaign: campaign)
    end
  end
end
