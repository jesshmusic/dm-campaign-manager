require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::NpcsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:npcs_path) { "/v1/campaigns/#{campaign.slug}/npcs" }

  it_behaves_like 'a campaign child resource', path: 'npcs', root: :npc, factory: :campaign_npc do
    let(:valid_attributes) do
      { name: 'Glasstaff', role: 'lieutenant', motive: 'Power', secret: 'He is Iarno', appearance: 'Robed',
        voice: 'Nasal', description: 'Wizard', notes: 'Flees' }
    end
    let(:created_json) do
      { 'name' => 'Glasstaff', 'role' => 'lieutenant', 'motive' => 'Power', 'secret' => 'He is Iarno',
        'appearance' => 'Robed', 'voice' => 'Nasal', 'monster' => nil, 'factionId' => nil,
        'statBlockReference' => nil, 'foundryActorUuid' => nil, 'foundryActorName' => nil }
    end
    let(:invalid_attributes) { { role: 'sidekick' } }
    let(:invalid_message) { 'Role is not included in the list' }
    let(:update_attributes) { { role: 'bbeg' } }
    let(:updated_json) { { 'role' => 'bbeg' } }
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    it 'links a book stat block reference' do
      reference = create(:campaign_reference, campaign: campaign, name: 'Cult Fanatic', page: 92)

      post npcs_path, params: { npc: { name: 'Brother Ash', stat_block_reference_id: reference.id } }, as: :json

      expect(response).to have_http_status(:created)
      expect(response.parsed_body['statBlockReference']).to eq(
        'id' => reference.id.to_s, 'name' => 'Cult Fanatic', 'citation' => 'Monster Manual p. 92'
      )
    end

    it 'rejects a book reference from another campaign' do
      reference = create(:campaign_reference, campaign: create(:campaign, user: user))

      post npcs_path, params: { npc: { name: 'Brother Ash', stat_block_reference_id: reference.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(response.parsed_body['errors']).to include('Stat block reference must belong to the same campaign')
    end

    it 'orders the cast by name' do
      create(:campaign_npc, campaign: campaign, name: 'Sildar')
      create(:campaign_npc, campaign: campaign, name: 'Gundren')

      get npcs_path

      expect(json.pluck('name')).to eq(%w[Gundren Sildar])
    end

    it 'links an SRD monster stat block and a faction' do
      monster = create(:monster, user: nil, name: 'Mage')
      faction = create(:campaign_faction, campaign: campaign)

      post npcs_path, params: { npc: { name: 'Glasstaff', monster_id: monster.id, faction_id: faction.id } }, as: :json

      expect(response).to have_http_status(:created)
      expect(json['monster']).to include('id' => monster.id.to_s, 'name' => 'Mage', 'slug' => monster.slug)
      expect(json['factionId']).to eq(faction.id.to_s)
    end

    it "links the DM's homebrew monster" do
      monster = create(:monster, user: user)

      post npcs_path, params: { npc: { name: 'Homebrew', monster_id: monster.id } }, as: :json

      expect(response).to have_http_status(:created)
    end

    it "rejects another user's homebrew monster" do
      monster = create(:monster, user: create(:dungeon_master_user))

      post npcs_path, params: { npc: { name: 'Stolen', monster_id: monster.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Monster is not available')
    end

    it 'rejects a monster that does not exist' do
      post npcs_path, params: { npc: { name: 'Ghost', monster_id: 0 } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Monster must exist')
    end

    it 'rejects a faction from another campaign' do
      faction = create(:campaign_faction, campaign: create(:campaign, user: user))

      post npcs_path, params: { npc: { name: 'Spy', faction_id: faction.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Faction must belong to the same campaign')
    end

    it "can't link a Foundry actor, which is picked in Foundry" do
      npc = create(:campaign_npc, campaign: campaign, name: 'Ash')

      patch "#{npcs_path}/#{npc.id}",
            params: { npc: { name: 'Brother Ash', foundry_actor_uuid: 'Actor.Kz8rTq2LmN4pQw7X', foundry_actor_name: 'Cult Fanatic' } },
            as: :json

      expect(response).to have_http_status(:success)
      expect(npc.reload).to have_attributes(name: 'Brother Ash', foundry_actor_uuid: nil, foundry_actor_name: nil)
    end

    it 'shows the Foundry actor linked in Foundry' do
      npc = create(:campaign_npc, campaign: campaign, foundry_actor_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmCultFanatic000',
                                  foundry_actor_name: 'Cult Fanatic')

      get "#{npcs_path}/#{npc.id}"

      expect(json).to include('foundryActorUuid' => 'Compendium.dnd-monster-manual.actors.Actor.mmCultFanatic000',
                              'foundryActorName' => 'Cult Fanatic')
    end

    it 'clears the monster link' do
      npc = create(:campaign_npc, campaign: campaign, monster: create(:monster, user: nil))

      patch "#{npcs_path}/#{npc.id}", params: { npc: { monster_id: nil } }, as: :json

      expect(response).to have_http_status(:success)
      expect(json['monster']).to be_nil
    end
  end
end
