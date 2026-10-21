require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::QuestLinksController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:quest) { create(:campaign_quest, campaign: campaign) }
  let(:links_path) { "/v1/campaigns/#{campaign.slug}/quests/#{quest.id}/links" }
  let(:npc) { create(:campaign_npc, campaign: campaign, name: 'Sildar') }

  def link(linkable_type, linkable_id, quantity: nil)
    post links_path, params: { link: { linkable_type: linkable_type, linkable_id: linkable_id, quantity: quantity } }, as: :json
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    describe 'POST /v1/campaigns/:campaign_id/quests/:quest_id/links' do
      it 'links an NPC involved in the quest, and bumps the quest for sync' do
        version = quest.reload.sync_version

        expect { link('CampaignNpc', npc.id) }.to change(quest.links, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(json).to include('linkableType' => 'CampaignNpc', 'linkableId' => npc.id.to_s, 'name' => 'Sildar',
                                'position' => 0, 'quantity' => nil)
        expect(json['uuid']).to be_present
        expect(quest.reload.sync_version).to be > version
      end

      it 'links reward items, from the SRD or the books, after the last link' do
        potion = create(:campaign_reference, campaign: campaign, name: 'Potion of Healing', category: 'magic_item')
        item = create(:magic_item, user: user)

        link('CampaignReference', potion.id)
        link('Item', item.id, quantity: 2)

        expect(response).to have_http_status(:created)
        expect(json).to include('linkableType' => 'Item', 'name' => item.name, 'quantity' => 2, 'position' => 1)
        expect(quest.links.pluck(:linkable_type)).to eq(%w[CampaignReference Item])
      end

      it "rejects monsters, from the SRD or the books: they go in the quest's encounters" do
        link('Monster', create(:monster, user: nil).id)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to eq(['Unknown link type'])

        link('CampaignReference', create(:campaign_reference, campaign: campaign, category: 'monster').id)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['errors']).to eq(["Linkable is a monster: monsters go in the quest's encounters"])
        expect(CampaignQuestLink.count).to eq(0)
      end

      it "rejects another user's homebrew, and records from the DM's other campaign" do
        link('Item', create(:magic_item, user: create(:dungeon_master_user)).id)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['errors']).to include('Linkable is not available to this campaign')

        link('CampaignNpc', create(:campaign_npc, campaign: create(:campaign, user: user)).id)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['errors']).to include('Linkable is not available to this campaign')

        expect(CampaignQuestLink.count).to eq(0)
      end

      it 'rejects a duplicate link' do
        link('CampaignNpc', npc.id)

        expect { link('CampaignNpc', npc.id) }.not_to change(CampaignQuestLink, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include('Linkable is already linked to this quest')
      end

      it 'rejects a link type a quest does not use' do
        %w[CampaignSecret CampaignLocation CampaignQuest CampaignFront CampaignSession User MagicItem Kernel].each do |type|
          link(type, user.id)

          expect(response).to have_http_status(:unprocessable_entity), "expected #{type} to be rejected"
          expect(response.parsed_body['errors']).to eq(['Unknown link type'])
        end
        expect(CampaignQuestLink.count).to eq(0)
      end

      it 'rejects a record that does not exist, and a quantity out of range' do
        link('CampaignNpc', 0)
        expect(response.parsed_body['errors']).to include('Linkable must exist')

        link('Item', create(:magic_item, user: nil).id, quantity: 10_000)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['errors']).to include(/Quantity must be/)
        expect(CampaignQuestLink.count).to eq(0)
      end

      it 'returns 404 for a quest from another campaign' do
        foreign_quest = create(:campaign_quest, campaign: create(:campaign, user: user))

        post "/v1/campaigns/#{campaign.slug}/quests/#{foreign_quest.id}/links",
             params: { link: { linkable_type: 'CampaignNpc', linkable_id: npc.id } }, as: :json

        expect(response).to have_http_status(:not_found)
        expect(CampaignQuestLink.count).to eq(0)
      end
    end

    describe 'PATCH /v1/campaigns/:campaign_id/quests/:quest_id/links/:id' do
      let(:potion) { create(:campaign_reference, campaign: campaign, name: 'Potion of Healing', category: 'magic_item') }
      let!(:quest_link) { create(:campaign_quest_link, quest: quest, linkable: potion) }
      let(:link_path) { "#{links_path}/#{quest_link.id}" }

      it 'changes only the quantity, and bumps the quest for sync' do
        version = quest.reload.sync_version
        other = create(:campaign_npc, campaign: campaign)

        patch link_path, params: { link: { quantity: 4, linkable_type: 'CampaignNpc', linkable_id: other.id, position: 9 } },
                         as: :json

        expect(response).to have_http_status(:success)
        expect(json).to include('id' => quest_link.id.to_s, 'name' => 'Potion of Healing', 'quantity' => 4)
        expect(quest_link.reload).to have_attributes(quantity: 4, linkable: potion, position: 0)
        expect(quest.reload.sync_version).to be > version
      end

      it 'clears the quantity' do
        quest_link.update!(quantity: 2)

        patch link_path, params: { link: { quantity: nil } }, as: :json

        expect(response).to have_http_status(:success)
        expect(quest_link.reload.quantity).to be_nil
      end

      it 'rejects a quantity out of range' do
        patch link_path, params: { link: { quantity: 0 } }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include(/Quantity must be/)
        expect(quest_link.reload.quantity).to be_nil
      end

      it 'returns 404 for a link on another quest' do
        other_quest = create(:campaign_quest, campaign: campaign)

        patch "/v1/campaigns/#{campaign.slug}/quests/#{other_quest.id}/links/#{quest_link.id}",
              params: { link: { quantity: 2 } }, as: :json

        expect(response).to have_http_status(:not_found)
        expect(quest_link.reload.quantity).to be_nil
      end
    end

    describe 'DELETE /v1/campaigns/:campaign_id/quests/:quest_id/links/:id' do
      let!(:quest_link) { create(:campaign_quest_link, quest: quest, linkable: npc) }

      it 'unlinks the record and leaves a tombstone' do
        expect { delete "#{links_path}/#{quest_link.id}" }.to change(CampaignTombstone, :count).by(1)

        expect(response).to have_http_status(:no_content)
        expect(CampaignQuestLink.exists?(quest_link.id)).to be false
        expect(CampaignNpc.exists?(npc.id)).to be true
        expect(CampaignTombstone.last).to have_attributes(campaign_id: campaign.id, record_type: 'CampaignQuestLink',
                                                          record_uuid: quest_link.uuid)
      end

      it 'returns 404 for a link on another quest' do
        other_quest = create(:campaign_quest, campaign: campaign)

        delete "/v1/campaigns/#{campaign.slug}/quests/#{other_quest.id}/links/#{quest_link.id}"

        expect(response).to have_http_status(:not_found)
        expect(CampaignQuestLink.exists?(quest_link.id)).to be true
      end
    end

    it 'deletes the links with their quest' do
      create(:campaign_quest_link, quest: quest, linkable: npc)

      expect { delete "/v1/campaigns/#{campaign.slug}/quests/#{quest.id}" }.to change(CampaignQuestLink, :count).by(-1)
      expect(response).to have_http_status(:no_content)
    end

    it 'deletes the links to an NPC deleted from the campaign' do
      create(:campaign_quest_link, quest: quest, linkable: npc)

      expect { delete "/v1/campaigns/#{campaign.slug}/npcs/#{npc.id}" }.to change(CampaignQuestLink, :count).by(-1)
      get "/v1/campaigns/#{campaign.slug}/quests/#{quest.id}"
      expect(json['links']).to eq([])
    end
  end

  context "with another user's campaign" do
    let!(:quest_link) { create(:campaign_quest_link, quest: quest, linkable: npc) }

    before { stub_authentication(create(:dungeon_master_user)) }

    it 'returns 404 and changes nothing' do
      link('CampaignNpc', create(:campaign_npc, campaign: campaign).id)
      expect(response).to have_http_status(:not_found)

      patch "#{links_path}/#{quest_link.id}", params: { link: { quantity: 2 } }, as: :json
      expect(response).to have_http_status(:not_found)

      delete "#{links_path}/#{quest_link.id}"
      expect(response).to have_http_status(:not_found)

      expect(CampaignQuestLink.pluck(:id)).to eq([quest_link.id])
      expect(quest_link.reload.quantity).to be_nil
    end
  end

  context 'when not authenticated' do
    let!(:quest_link) { create(:campaign_quest_link, quest: quest, linkable: npc) }

    before { stub_no_auth }

    it 'returns 401 and changes nothing' do
      link('CampaignNpc', create(:campaign_npc, campaign: campaign).id)
      expect(response).to have_http_status(:unauthorized)

      patch "#{links_path}/#{quest_link.id}", params: { link: { quantity: 2 } }, as: :json
      expect(response).to have_http_status(:unauthorized)

      delete "#{links_path}/#{quest_link.id}"
      expect(response).to have_http_status(:unauthorized)

      expect(CampaignQuestLink.pluck(:id)).to eq([quest_link.id])
    end
  end
end
