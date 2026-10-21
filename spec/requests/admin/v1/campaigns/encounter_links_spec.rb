require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::EncounterLinksController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:quest) { create(:campaign_quest, campaign: campaign) }
  let(:encounter) { create(:campaign_encounter, quest: quest) }
  let(:links_path) { "/v1/campaigns/#{campaign.slug}/quests/#{quest.id}/encounters/#{encounter.id}/links" }
  let(:ghoul) { create(:monster, user: nil, name: 'Ghoul', challenge_rating: '1') }

  def link(linkable_type, linkable_id, quantity: nil)
    post links_path, params: { link: { linkable_type: linkable_type, linkable_id: linkable_id, quantity: quantity } }, as: :json
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    describe 'POST .../links' do
      it 'links monsters with how many, NPCs and reward items, in order, and bumps the encounter for sync' do
        version = encounter.reload.sync_version
        fanatic = create(:campaign_reference, campaign: campaign, name: 'Cult Fanatic', category: 'monster')
        npc = create(:campaign_npc, campaign: campaign, name: 'Sildar')
        potion = create(:campaign_reference, campaign: campaign, name: 'Potion of Healing', category: 'magic_item')

        link('Monster', ghoul.id, quantity: 4)
        expect(json).to include('linkableType' => 'Monster', 'name' => 'Ghoul', 'detail' => 'CR 1', 'quantity' => 4, 'position' => 0)
        link('CampaignReference', fanatic.id)
        link('CampaignNpc', npc.id)
        link('CampaignReference', potion.id, quantity: 2)
        link('Monster', create(:monster, user: user, name: 'My homebrew').id)

        expect(response).to have_http_status(:created)
        expect(encounter.links.reload.map { |each| [each.linkable.name, each.quantity, each.position] })
          .to eq([['Ghoul', 4, 0], ['Cult Fanatic', nil, 1], ['Sildar', nil, 2], ['Potion of Healing', 2, 3], ['My homebrew', nil, 4]])
        expect(encounter.reload.sync_version).to be > version
      end

      it "rejects another user's homebrew, a type an encounter doesn't link, and a bad count" do
        link('Monster', create(:monster, user: create(:dungeon_master_user)).id)
        expect(response.parsed_body['errors']).to include('Linkable is not available to this campaign')

        link('CampaignSecret', create(:campaign_secret, campaign: campaign).id)
        expect(response.parsed_body['errors']).to eq(['Unknown link type'])

        link('Monster', ghoul.id, quantity: 0)
        expect(response).to have_http_status(:unprocessable_entity)
        expect(response.parsed_body['errors']).to include(/Quantity must be/)
        expect(CampaignEncounterLink.count).to eq(0)
      end

      it "returns 404 for another quest's encounter" do
        other = create(:campaign_encounter, quest: create(:campaign_quest, campaign: campaign))

        post "/v1/campaigns/#{campaign.slug}/quests/#{quest.id}/encounters/#{other.id}/links",
             params: { link: { linkable_type: 'Monster', linkable_id: ghoul.id } }, as: :json

        expect(response).to have_http_status(:not_found)
        expect(CampaignEncounterLink.count).to eq(0)
      end
    end

    describe 'PATCH .../links/:id' do
      let!(:encounter_link) { create(:campaign_encounter_link, encounter: encounter, linkable: ghoul) }

      it 'changes only how many' do
        patch "#{links_path}/#{encounter_link.id}", params: { link: { quantity: 6, position: 4 } }, as: :json

        expect(response).to have_http_status(:success)
        expect(encounter_link.reload).to have_attributes(quantity: 6, position: 0)
      end
    end

    describe 'DELETE .../links/:id' do
      let!(:encounter_link) { create(:campaign_encounter_link, encounter: encounter, linkable: ghoul) }

      it 'unlinks it, leaving a tombstone' do
        expect { delete "#{links_path}/#{encounter_link.id}" }.to change(CampaignTombstone, :count).by(1)

        expect(response).to have_http_status(:no_content)
        expect(CampaignTombstone.last).to have_attributes(record_type: 'CampaignEncounterLink', record_uuid: encounter_link.uuid)
        expect(Monster.exists?(ghoul.id)).to be true
      end
    end
  end

  context "with another user's campaign" do
    let!(:encounter_link) { create(:campaign_encounter_link, encounter: encounter, linkable: ghoul) }

    before { stub_authentication(create(:dungeon_master_user)) }

    it 'returns 404 and changes nothing' do
      link('Monster', ghoul.id)
      expect(response).to have_http_status(:not_found)

      patch "#{links_path}/#{encounter_link.id}", params: { link: { quantity: 2 } }, as: :json
      expect(response).to have_http_status(:not_found)

      delete "#{links_path}/#{encounter_link.id}"
      expect(response).to have_http_status(:not_found)

      expect(CampaignEncounterLink.pluck(:id, :quantity)).to eq([[encounter_link.id, nil]])
    end
  end

  context 'when not authenticated' do
    before { stub_no_auth }

    it 'returns 401' do
      link('Monster', ghoul.id)

      expect(response).to have_http_status(:unauthorized)
    end
  end
end
