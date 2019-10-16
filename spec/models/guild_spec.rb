# == Schema Information
#
# Table name: guilds
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_guilds_on_campaign_id  (campaign_id)
#  index_guilds_on_slug         (slug)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

require 'rails_helper'

RSpec.describe Guild, type: :model do
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
    @pc = PlayerCharacter.create(name: 'Bob', campaign: campaign, hit_points: 24)
    @pc.character_classes << char_class
    @pc.save!
    @pc2 = PlayerCharacter.create(name: 'Bob', campaign: campaign)
    @pc2.character_classes << char_class2
    @pc2.save!
    @guild = Guild.create(name: "Thieves' Guild",
                          description: 'The local 286 guild of scoundrels')
    @guild.characters << [@npc, @npc2, @pc2]
    @guild.campaign = campaign
    @guild.save!
    @guild2 = Guild.create(name: "Thieves' Guild",
                           description: 'The local 286 guild of scoundrels')
    @guild2.characters << [@pc]
    @guild2.campaign = campaign
    @guild2.save!
  end

  context "with the same name" do
    it "generates unique slugs for Guilds" do

      expect(@guild.slug).to eq('thieves-guild')
      expect(@guild2.slug).to eq('thieves-guild-1')
    end

    it "maintains same slug on update with no name change for Guilds" do
      @guild.update(description: 'Edited')
      expect(Guild.all.count).to eq(2)
      @guild.reload
      expect(@guild.slug).to eq('thieves-guild')
      @guild.update(description: 'Edited again')
      expect(Guild.all.count).to eq(2)
      @guild.reload
      expect(@guild.slug).to eq('thieves-guild')
      @guild.update(description: 'Edited again again')
      expect(Guild.all.count).to eq(2)
      @guild.reload
      expect(@guild.slug).to eq('thieves-guild')
    end
  end

  context "Guild1 has PCs and/or NPCs" do
    it 'should have 2 NPCs' do
      expect(@guild.npcs.count).to eq(2)
      expect(@guild.npcs.first.type).to eq('NonPlayerCharacter')
      expect(@guild.npcs.first.name).to eq(@npc.name)
      expect(@guild.npcs[1].type).to eq('NonPlayerCharacter')
      expect(@guild.npcs[1].name).to eq(@npc2.name)
    end

    it 'should have 1 PC' do
      expect(@guild.pcs.count).to eq(1)
      expect(@guild.pcs.first.type).to eq('PlayerCharacter')
      expect(@guild2.pcs.first.name).to eq(@pc2.name)
    end
  end

  context "Guild 2 has PCs and/or NPCs" do
    it 'should have 0 NPCs' do
      expect(@guild2.npcs.count).to eq(0)
    end

    it 'should have 1 PC' do
      expect(@guild2.pcs.count).to eq(1)
      expect(@guild2.pcs.first.type).to eq('PlayerCharacter')
      expect(@guild2.pcs.first.name).to eq(@pc.name)
    end
  end
end
