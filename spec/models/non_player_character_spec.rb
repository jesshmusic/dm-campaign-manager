# == Schema Information
#
# Table name: characters
#
#  id                   :bigint           not null, primary key
#  alignment            :string           default("neutral")
#  armor_class          :integer          default(10), not null
#  armor_class_modifier :integer          default(0), not null
#  background           :string           default("Acolyte")
#  charisma             :integer          default(10), not null
#  constitution         :integer          default(10), not null
#  copper_pieces        :integer          default(0)
#  description          :text             default("Enter this character's backstory, history, or notes here.")
#  dexterity            :integer          default(10), not null
#  electrum_pieces      :integer          default(0)
#  gold_pieces          :integer          default(0)
#  hit_points           :integer          default(8), not null
#  hit_points_current   :integer          default(8), not null
#  initiative           :integer          default(0), not null
#  intelligence         :integer          default(10), not null
#  languages            :string           default("Common")
#  name                 :string           not null
#  platinum_pieces      :integer          default(0)
#  proficiency          :integer          default(2)
#  role                 :string           default("Player Character")
#  silver_pieces        :integer          default(0), not null
#  slug                 :string           not null
#  speed                :string           default("30 feet"), not null
#  status               :integer          default("alive"), not null
#  strength             :integer          default(10), not null
#  type                 :string
#  wisdom               :integer          default(10), not null
#  xp                   :integer          default(0), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  armor_id             :integer
#  campaign_id          :bigint
#  race_id              :integer          default(1), not null
#  shield_id            :integer
#  weapon_2h_id         :integer
#  weapon_lh_id         :integer
#  weapon_rh_id         :integer
#
# Indexes
#
#  index_characters_on_campaign_id  (campaign_id)
#  index_characters_on_slug         (slug)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

require 'rails_helper'

RSpec.describe NonPlayerCharacter, type: :model do
  before(:each) do
    dungeon_master = FactoryBot.create(:dungeon_master_user)
    campaign = FactoryBot.create(:campaign, user: dungeon_master, name: 'Test Campaign')
    dnd_class = DndClass.create!(name: 'Fighter', hit_die: 10)
    char_class = CharacterClass.create(level: 1, dnd_class: dnd_class)
    char_class2 = CharacterClass.create(level: 1, dnd_class: dnd_class)
    @npc = NonPlayerCharacter.create(name: 'Bob', campaign: campaign)
    @npc.character_classes << char_class
    @npc.save!
    @npc2 = NonPlayerCharacter.create(name: 'Bob', campaign: campaign)
    @npc2.character_classes << char_class2
    @npc2.save!
  end

  context "with the same name" do
    it "generates unique slugs for PCs" do

      expect(@npc.slug).to eq('test-campaign-bob')
      expect(@npc2.slug).to eq('test-campaign-bob-1')
    end

    it "maintains same slug on update with no name change for PCs" do
      @npc.update(strength: 12)
      expect(NonPlayerCharacter.all.count).to eq(2)
      @npc.reload
      expect(@npc.slug).to eq('test-campaign-bob')
      @npc.update(strength: 8)
      expect(NonPlayerCharacter.all.count).to eq(2)
      @npc.reload
      expect(@npc.slug).to eq('test-campaign-bob')
      @npc.update(strength: 12)
      expect(NonPlayerCharacter.all.count).to eq(2)
      @npc.reload
      expect(@npc.slug).to eq('test-campaign-bob')
    end
  end

  context 'maintains status based on current hit points' do
    it 'should be status "dead"' do
      @npc.update(hit_points_current: 0)
      expect(@npc.status).to eq('dead')
    end

    it 'should be status "alive"' do
      expect(@npc.status).to eq('alive')
    end
  end
end
