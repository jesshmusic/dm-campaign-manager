# == Schema Information
#
# Table name: encounters
#
#  id                :bigint           not null, primary key
#  copper_pieces     :integer          default(0)
#  current_mob_index :integer          default(0)
#  description       :text
#  electrum_pieces   :integer          default(0)
#  gold_pieces       :integer          default(0)
#  in_progress       :boolean          default(FALSE)
#  location          :string           default("New Location"), not null
#  name              :string           default("New Encounter")
#  platinum_pieces   :integer          default(0)
#  round             :integer          default(1)
#  silver_pieces     :integer          default(0)
#  sort              :integer          default(0), not null
#  xp                :integer          default(0)
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  adventure_id      :bigint
#
# Indexes
#
#  index_encounters_on_adventure_id  (adventure_id)
#
# Foreign Keys
#
#  fk_rails_...  (adventure_id => adventures.id)
#

FactoryBot.define do
  factory :encounter do
    name { Faker::Games::ElderScrolls.region }
    description { Faker::TvShows::BreakingBad.episode }
    location { Faker::Movies::Hobbit.location }
    platinum_pieces { Faker::Number.between(from: 0, to: 10) }
    gold_pieces { Faker::Number.between(from: 0, to: 10) }
    electrum_pieces { Faker::Number.between(from: 0, to: 10) }
    silver_pieces { Faker::Number.between(from: 0, to: 10) }
    copper_pieces { Faker::Number.between(from: 0, to: 10) }

    transient do
      encounter_items { rand(1..3) }
      encounter_monsters { rand(1..3) }
      encounter_npcs { rand(0..2) }
    end

    before(:create) do |encounter, evaluator|
      create_list(:encounter_item, evaluator.encounter_items, encounter: encounter)
      create_list(:encounter_monster, evaluator.encounter_monsters, encounter: encounter)
      create_list(:encounter_npc, evaluator.encounter_npcs, encounter: encounter)
    end
  end
end
