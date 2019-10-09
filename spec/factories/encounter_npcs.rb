# == Schema Information
#
# Table name: encounter_items
#
#  id           :bigint           not null, primary key
#  quantity     :integer          default(1), not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  encounter_id :bigint
#  item_id      :bigint
#
# Indexes
#
#  index_encounter_items_on_encounter_id  (encounter_id)
#  index_encounter_items_on_item_id       (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (encounter_id => encounters.id)
#  fk_rails_...  (item_id => items.id)
#

FactoryBot.define do
  factory :encounter_npc do
    before(:create) do |encounter_npc|
      campaign = encounter_npc.encounter.adventure.campaign
      encounter_npc.character = FactoryBot.create(:non_player_character, campaign: campaign)
    end
  end
end
