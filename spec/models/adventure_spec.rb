# frozen_string_literal: true

# == Schema Information
#
# Table name: adventures
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  sort        :integer          default(0), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_adventures_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

require 'rails_helper'

RSpec.describe Adventure, type: :model do
  let!(:race) { create :race, id: 1, name: 'Human'}

  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:campaign) { create :campaign_with_full_adventure, user: dungeon_master }

  describe 'Adventure Object' do
    context 'has associations' do
      before(:each) do
        @adventure = campaign.adventures.first
        @adventure.characters << campaign.npcs.first
        @adventure.save!
      end

      it "is named\"Introduction - Catacombs Raid\"" do
        expect(@adventure.name).to eq('Introduction - Catacombs Raid')
      end

      it "is have at least 1 encounter" do
        expect(@adventure.encounters.count).to be >= 1
      end

      it "is has 5 PCs" do
        expect(@adventure.pcs.count).to eq(5)
      end

      it "is has 1 NPC" do
        expect(@adventure.npcs.count).to eq(1)
      end
    end

    context 'Creating Adventures' do
      before(:each) do
        @adventure = Adventure.create(name: 'New Adventure', description: 'This is a new adventure', campaign: campaign)
      end
      it "creates a new adventure associated with the campaign" do
        expect(@adventure.campaign).not_to be_nil
        campaign.reload
        expect(campaign.adventures.last.id).to eq(@adventure.id)
      end

      it "Adds all Campaign PCs to the adventure" do
        @adventure.add_all_campaign_pcs
        @adventure.reload
        expect(@adventure.pcs.count).to eq(5)
      end
    end
  end
end
