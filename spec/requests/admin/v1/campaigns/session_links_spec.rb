require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::SessionLinksController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:session) { create(:campaign_session, campaign: campaign) }
  let(:links_path) { "/v1/campaigns/#{campaign.slug}/sessions/#{session.id}/links" }
  let(:npc) { create(:campaign_npc, campaign: campaign, name: 'Sildar') }

  def link(linkable_type, linkable_id)
    post links_path, params: { link: { linkable_type: linkable_type, linkable_id: linkable_id } }, as: :json
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    describe 'POST /v1/campaigns/:campaign_id/sessions/:session_id/links' do
      it 'links a campaign record to the session' do
        expect { link('CampaignNpc', npc.id) }.to change(session.links, :count).by(1)

        expect(response).to have_http_status(:created)
        expect(json).to include('linkableType' => 'CampaignNpc', 'linkableId' => npc.id.to_s, 'name' => 'Sildar',
                                'position' => 0)
        expect(json['uuid']).to be_present
      end

      it 'links each kind of campaign record' do
        records = [create(:campaign_secret, campaign: campaign), create(:campaign_location, campaign: campaign),
                   create(:campaign_quest, campaign: campaign), create(:campaign_front, campaign: campaign)]

        records.each do |record|
          link(record.class.name, record.id)
          expect(response).to have_http_status(:created), "expected to link a #{record.class.name}"
        end
        expect(session.links.pluck(:linkable_type)).to eq(%w[CampaignSecret CampaignLocation CampaignQuest CampaignFront])
      end

      it 'adds each link after the last one' do
        link('CampaignNpc', npc.id)
        link('CampaignNpc', create(:campaign_npc, campaign: campaign).id)

        expect(json['position']).to eq(1)
      end

      it 'links an SRD monster' do
        monster = create(:monster, user: nil, name: 'Owlbear')

        link('Monster', monster.id)

        expect(response).to have_http_status(:created)
        expect(json).to include('linkableType' => 'Monster', 'name' => 'Owlbear', 'slug' => monster.slug)
      end

      it "links the DM's own homebrew item" do
        item = create(:magic_item, user: user)

        link('Item', item.id)

        expect(response).to have_http_status(:created)
        expect(json).to include('linkableType' => 'Item', 'name' => item.name)
      end

      it "rejects another user's homebrew monster" do
        monster = create(:monster, user: create(:dungeon_master_user))

        expect { link('Monster', monster.id) }.not_to change(CampaignSessionLink, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include('Linkable is not available to this campaign')
      end

      it "rejects a record from the DM's other campaign" do
        foreign = create(:campaign_npc, campaign: create(:campaign, user: user))

        expect { link('CampaignNpc', foreign.id) }.not_to change(CampaignSessionLink, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include('Linkable is not available to this campaign')
      end

      it 'rejects a duplicate link' do
        link('CampaignNpc', npc.id)

        expect { link('CampaignNpc', npc.id) }.not_to change(CampaignSessionLink, :count)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include('Linkable is already linked to this session')
      end

      it 'rejects a link type that is not allowed' do
        %w[User Campaign CampaignSession CampaignFaction MagicItem Kernel].each do |type|
          link(type, user.id)

          expect(response).to have_http_status(:unprocessable_entity), "expected #{type} to be rejected"
          expect(json['errors']).to eq(['Unknown link type'])
        end
        expect(CampaignSessionLink.count).to eq(0)
      end

      it 'rejects a missing link type' do
        post links_path, params: { link: { linkable_id: npc.id } }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to eq(['Unknown link type'])
      end

      it 'rejects a record that does not exist' do
        link('CampaignNpc', 0)

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include('Linkable must exist')
      end

      it 'returns 404 for a session from another campaign' do
        foreign_session = create(:campaign_session, campaign: create(:campaign, user: user))

        post "/v1/campaigns/#{campaign.slug}/sessions/#{foreign_session.id}/links",
             params: { link: { linkable_type: 'CampaignNpc', linkable_id: npc.id } }, as: :json

        expect(response).to have_http_status(:not_found)
        expect(CampaignSessionLink.count).to eq(0)
      end
    end

    describe 'DELETE /v1/campaigns/:campaign_id/sessions/:session_id/links/:id' do
      let!(:session_link) { create(:campaign_session_link, session: session, linkable: npc) }

      it 'unlinks the record and leaves a tombstone' do
        expect { delete "#{links_path}/#{session_link.id}" }.to change(CampaignTombstone, :count).by(1)

        expect(response).to have_http_status(:no_content)
        expect(CampaignSessionLink.exists?(session_link.id)).to be false
        expect(CampaignNpc.exists?(npc.id)).to be true
        expect(CampaignTombstone.last).to have_attributes(campaign_id: campaign.id, record_type: 'CampaignSessionLink',
                                                          record_uuid: session_link.uuid)
      end

      it 'returns 404 for a link on another session' do
        other_session = create(:campaign_session, campaign: campaign)

        delete "/v1/campaigns/#{campaign.slug}/sessions/#{other_session.id}/links/#{session_link.id}"

        expect(response).to have_http_status(:not_found)
        expect(CampaignSessionLink.exists?(session_link.id)).to be true
      end
    end
  end

  context "with another user's campaign" do
    let!(:session_link) { create(:campaign_session_link, session: session, linkable: npc) }

    before { stub_authentication(create(:dungeon_master_user)) }

    it 'returns 404 and changes nothing' do
      link('CampaignNpc', create(:campaign_npc, campaign: campaign).id)
      expect(response).to have_http_status(:not_found)

      delete "#{links_path}/#{session_link.id}"
      expect(response).to have_http_status(:not_found)

      expect(CampaignSessionLink.pluck(:id)).to eq([session_link.id])
    end
  end

  context 'when not authenticated' do
    let!(:session_link) { create(:campaign_session_link, session: session, linkable: npc) }

    before { stub_no_auth }

    it 'returns 401 and changes nothing' do
      link('CampaignNpc', create(:campaign_npc, campaign: campaign).id)
      expect(response).to have_http_status(:unauthorized)

      delete "#{links_path}/#{session_link.id}"
      expect(response).to have_http_status(:unauthorized)

      expect(CampaignSessionLink.pluck(:id)).to eq([session_link.id])
    end
  end
end
