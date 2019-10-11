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

require 'rails_helper'

RSpec.describe Encounter, type: :model do
  let!(:race) { create :race, id: 1, name: 'Human'}

  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:campaign) { create :campaign_with_full_adventure, user: dungeon_master }
  let!(:monster) { create :monster,
                          name: 'Orc',
                          hit_dice_number: 2,
                          hit_dice_value: 10,
                          challenge_rating: '1/2',
                          hit_points: 15 }
  let!(:item) { create :armor_item, name: 'Mithril Armor' }

  describe 'Encounter Model' do
    before(:each) do
      @campaign_npc = campaign.npcs.first
      @campaign_npc.name = 'Andrade Mirrius'
      @campaign_npc.save!
      @adventure = campaign.adventures.first
      @prev_encounter = @adventure.encounters.last
      @encounter = Encounter.create(
        name: 'Test Encounter',
        description: 'A simple encounter for testing purposes',
        location: 'Caves of Testing',
        copper_pieces: 10,
        electrum_pieces: 20,
        gold_pieces: 30,
        platinum_pieces: 40,
        silver_pieces: 10,
        adventure: @adventure
      )
      @encounter.encounter_monsters << EncounterMonster.create(number_of_monsters: 5, monster: monster)
      @encounter.encounter_items << EncounterItem.create(quantity: 2, item: item)
      @encounter.update_encounter
      @encounter.save!
      @encounter.reload
      @adventure.reload
    end
    context 'has associations' do
      it "should be named\"Test Encounter\"" do
        expect(@encounter.name).to eq('Test Encounter')
      end

      it "should be associated with the adventure" do
        expect(@encounter.adventure).to eq(@adventure)
      end

      it "should have 1 EncounterMonster with 5 Orcs" do
        expect(@encounter.encounter_monsters.count).to eq(1)
        expect(@encounter.encounter_monsters.first).not_to be_nil
        expect(@encounter.encounter_monsters.first.number_of_monsters).to eq(5)
        expect(@encounter.encounter_monsters.first.monster).to eq(monster)
      end

      it "should have 2 Mithril Armor Items" do
        expect(@encounter.encounter_items.count).to eq(1)
        expect(@encounter.encounter_items.first).not_to be_nil
        expect(@encounter.encounter_items.first.quantity).to eq(2)
        expect(@encounter.encounter_items.first.item).to eq(item)
      end

      it "should have 1 NPC" do
        @encounter.characters << @campaign_npc
        @encounter.save!
        @encounter.reload
        expect(@encounter.npcs.count).to eq(1)
        expect(@encounter.npcs.first).not_to be_nil
        expect(@encounter.npcs.first).to eq(@campaign_npc)
      end
    end

    context 'Encounter methods' do
      it 'should have the correct next encounter id' do
        expect(@encounter.next_encounter_id).to eq(@adventure.encounters.first.id)
      end

      it 'should have the correct previous encounter id' do
        expect(@encounter.prev_encounter_id).to eq(@prev_encounter.id)
      end

      it "should calculate the correct XP for combatants only" do
        @encounter.encounter_npcs << EncounterNpc.create(is_combatant: false, character: @campaign_npc)
        @encounter.save!
        @encounter.reload
        expect(@encounter.xp).to eq(500)
      end

      it "should calculate the correct XP for combatants including NPC" do
        @encounter.encounter_npcs << EncounterNpc.create(is_combatant: true, character: @campaign_npc)
        @encounter.save!
        @encounter.reload
        expect(@encounter.xp).to be > 500
      end
    end

    context 'Encounter Tracker' do
      it 'should have 10 combatants' do
        expect(@encounter.encounter_combatants.count).to eq(10)
      end

      it 'should have 11 combatants when NPC is added and the encounter is reset' do
        @encounter.characters << @campaign_npc
        @encounter.update_encounter
        @encounter.save!
        @encounter.reload
        expect(@encounter.encounter_combatants.count).to eq(11)
      end

      it 'should start with the proper encounter state' do
        expect(@encounter.round).to eq(1)
        expect(@encounter.current_mob_index).to eq(0)
      end
    end
  end
end
