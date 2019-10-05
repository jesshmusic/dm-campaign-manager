# == Schema Information
#
# Table name: campaigns
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  world       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_campaigns_on_slug     (slug) UNIQUE
#  index_campaigns_on_user_id  (user_id)
#

require 'rails_helper'

RSpec.describe Campaign, type: :model do
  context "with the same name" do
    before(:each) do
      dungeon_master = FactoryBot.create(:dungeon_master_user)
      @campaign = Campaign.create!(name: 'Test Campaign', world: 'Test World', user: dungeon_master)
      @campaign1 = Campaign.create!(name: 'Test Campaign', world: 'Test World', user: dungeon_master)
    end
    it "generates unique slugs for PCs" do
      expect(@campaign.slug).to eq('test-campaign-jesshdm')
      expect(@campaign1.slug).to eq('test-campaign-jesshdm-1')
    end

    it "maintains same slug on update with no name change for PCs" do
      @campaign.update(world: 'Test World Edited')
      expect(Campaign.all.count).to eq(2)
      @campaign.reload
      expect(@campaign.slug).to eq('test-campaign-jesshdm')
      @campaign.update(world: 'Test World')
      expect(Campaign.all.count).to eq(2)
      @campaign.reload
      expect(@campaign.slug).to eq('test-campaign-jesshdm')
      @campaign.update(world: 'Test World Edited')
      expect(Campaign.all.count).to eq(2)
      @campaign.reload
      expect(@campaign.slug).to eq('test-campaign-jesshdm')
    end
  end
end
