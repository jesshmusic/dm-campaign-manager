# == Schema Information
#
# Table name: encounter_combatants
#
#  id                  :bigint           not null, primary key
#  combat_order_number :integer          default(0)
#  current_hit_points  :integer          default(0)
#  initiative_roll     :integer          default(0)
#  name                :string
#  notes               :text             default("")
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  character_id        :bigint
#  encounter_id        :bigint
#  monster_id          :bigint
#
# Indexes
#
#  index_encounter_combatants_on_character_id  (character_id)
#  index_encounter_combatants_on_encounter_id  (encounter_id)
#  index_encounter_combatants_on_monster_id    (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (encounter_id => encounters.id)
#  fk_rails_...  (monster_id => monsters.id)
#

FactoryBot.define do
  factory :encounter_combatant do
    encounter { nil }
    character { nil }
    monster { nil }
    current_hit_points { 1 }
    initiative_roll { 1 }
    combat_order_number { 1 }
    notes { "MyText" }
  end
end
