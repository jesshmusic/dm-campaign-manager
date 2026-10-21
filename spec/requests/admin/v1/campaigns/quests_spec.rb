require 'rails_helper'

RSpec.describe 'Admin::V1::Campaigns::QuestsController', type: :request do
  let(:json) { response.parsed_body }
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }
  let(:quests_path) { "/v1/campaigns/#{campaign.slug}/quests" }

  it_behaves_like 'a campaign child resource', path: 'quests', root: :quest, factory: :campaign_quest do
    let(:valid_attributes) do
      { name: 'Find Cragmaw Castle', kind: 'main', status: 'active', act: 1, position: 2, level_min: 2, level_max: 3,
        reward: '200 gp', description: 'Rescue Gundren', notes: 'Owlbear' }
    end
    let(:created_json) do
      { 'name' => 'Find Cragmaw Castle', 'kind' => 'main', 'status' => 'active', 'act' => 1, 'position' => 2,
        'levelMin' => 2, 'levelMax' => 3, 'reward' => '200 gp' }
    end
    let(:invalid_attributes) { { level_min: 5, level_max: 2 } }
    let(:invalid_message) { "Level max can't be lower than the minimum level" }
    let(:update_attributes) { { status: 'completed' } }
    let(:updated_json) { { 'status' => 'completed' } }
  end

  context 'when signed in as the campaign owner' do
    before { stub_authentication(user) }

    it 'orders main quests by act and position before side quests' do
      side = create(:campaign_quest, campaign: campaign, kind: 'side', name: 'Side')
      act_two = create(:campaign_quest, campaign: campaign, kind: 'main', act: 2, name: 'Act II')
      act_one_late = create(:campaign_quest, campaign: campaign, kind: 'main', act: 1, position: 1, name: 'Act I b')
      act_one = create(:campaign_quest, campaign: campaign, kind: 'main', act: 1, position: 0, name: 'Act I a')

      get quests_path

      expect(json.pluck('id')).to eq([act_one, act_one_late, act_two, side].map { |quest| quest.id.to_s })
    end

    it 'links a parent quest, giver and location from the campaign' do
      parent = create(:campaign_quest, campaign: campaign)
      npc = create(:campaign_npc, campaign: campaign)
      location = create(:campaign_location, campaign: campaign)

      post quests_path, params: { quest: { name: 'Sub-quest', parent_id: parent.id, giver_npc_id: npc.id,
                                           location_id: location.id } }, as: :json

      expect(response).to have_http_status(:created)
      expect(json).to include('parentId' => parent.id.to_s, 'giverNpcId' => npc.id.to_s, 'locationId' => location.id.to_s)
    end

    it 'rejects links from another campaign' do
      elsewhere = create(:campaign, user: user)

      post quests_path, params: { quest: { name: 'Cross-campaign', giver_npc_id: create(:campaign_npc, campaign: elsewhere).id,
                                           location_id: create(:campaign_location, campaign: elsewhere).id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Giver npc must belong to the same campaign', 'Location must belong to the same campaign')
    end

    it 'rejects an unknown kind' do
      post quests_path, params: { quest: { name: 'Epic', kind: 'epic' } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include('Kind is not included in the list')
    end

    describe 'maps and reward' do
      let(:quest) { create(:campaign_quest, campaign: campaign, reward: 'The mayor owes them') }
      let(:scenes) { [{ 'uuid' => 'Scene.5wVcsNPOg2RjRbFx', 'name' => 'Mountain Pass' }, { 'uuid' => 'Scene.aaaaaaaaaaaaaaaa', 'name' => 'Cave' }] }

      it 'saves the maps picked on the website, the coins, XP and milestone' do
        patch "#{quests_path}/#{quest.id}",
              params: { quest: { foundry_scenes: scenes, reward_currency: { gp: 50, sp: '12' }, reward_xp: 450, milestone: true } },
              as: :json

        expect(response).to have_http_status(:success)
        expect(json).to include('foundryScenes' => scenes, 'rewardCurrency' => { 'gp' => 50, 'sp' => 12 }, 'rewardXp' => 450,
                                'milestone' => true, 'reward' => 'The mayor owes them', 'links' => [])
        expect(quest.reload).to have_attributes(foundry_scenes: scenes, reward_currency: { 'gp' => 50, 'sp' => 12 }, reward_xp: 450,
                                                milestone: true)
      end

      it 'clears them' do
        quest.update!(foundry_scenes: scenes, reward_currency: { gp: 50 }, reward_xp: 450, milestone: true)

        patch "#{quests_path}/#{quest.id}", params: { quest: { foundry_scenes: [], reward_currency: {}, reward_xp: nil, milestone: false } },
                                            as: :json

        expect(response).to have_http_status(:success)
        expect(quest.reload).to have_attributes(foundry_scenes: [], reward_currency: {}, reward_xp: nil, milestone: false)
      end

      it 'keeps them when other fields change' do
        quest.update!(foundry_scenes: scenes, reward_currency: { gp: 50 }, reward_xp: 450, milestone: true)

        patch "#{quests_path}/#{quest.id}", params: { quest: { name: 'Renamed' } }, as: :json

        expect(quest.reload).to have_attributes(name: 'Renamed', foundry_scenes: scenes, reward_currency: { 'gp' => 50 },
                                                reward_xp: 450, milestone: true)
      end

      it 'drops coins that are not pp, gp, ep, sp or cp, and keeps only the uuid and name of each scene' do
        patch "#{quests_path}/#{quest.id}",
              params: { quest: { reward_currency: { gp: 5, zz: 3 }, foundry_scenes: [scenes.first.merge('img' => 'pass.webp')] } },
              as: :json

        expect(response).to have_http_status(:success)
        expect(quest.reload).to have_attributes(reward_currency: { 'gp' => 5 }, foundry_scenes: [scenes.first])
      end

      it 'rejects bad scenes, coins and XP' do
        patch "#{quests_path}/#{quest.id}",
              params: { quest: { foundry_scenes: [{ uuid: 'Actor.5wVcsNPOg2RjRbFx', name: 'Not a scene' }], reward_currency: { gp: -1 },
                                 reward_xp: -5 } },
              as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include(/Foundry scenes must be/, /Reward currency must be/, /Reward xp must be/)
        expect(quest.reload).to have_attributes(foundry_scenes: [], reward_currency: {}, reward_xp: nil)
      end

      it 'lists each quest with its links' do
        create(:campaign_quest_link, quest: quest, linkable: create(:campaign_npc, campaign: campaign, name: 'Sildar'))

        get quests_path

        expect(json.sole['links'].sole).to include('linkableType' => 'CampaignNpc', 'name' => 'Sildar')
      end
    end

    describe 'handouts' do
      let(:handouts) do
        [{ 'uuid' => 'JournalEntry.5wVcsNPOg2RjRbFx', 'name' => 'A letter' },
         { 'uuid' => 'JournalEntry.5wVcsNPOg2RjRbFx.JournalEntryPage.abcdefghijklmnop', 'name' => 'The map' }]
      end
      let(:quest) { create(:campaign_quest, campaign: campaign, handouts: handouts) }

      it 'shows the handouts added in Foundry' do
        get "#{quests_path}/#{quest.id}"

        expect(json['handouts']).to eq(handouts)
      end

      it 'removes one, keeping the order of the rest' do
        patch "#{quests_path}/#{quest.id}", params: { quest: { handouts: [handouts.last] } }, as: :json

        expect(response).to have_http_status(:success)
        expect(quest.reload.handouts).to eq([handouts.last])
      end

      it 'removes them all' do
        patch "#{quests_path}/#{quest.id}", params: { quest: { handouts: [] } }, as: :json

        expect(response).to have_http_status(:success)
        expect(quest.reload.handouts).to eq([])
      end

      it "rejects a handout that isn't a journal entry or page" do
        patch "#{quests_path}/#{quest.id}", params: { quest: { handouts: [{ uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'Pass' }] } },
                                            as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to include(/Handouts must be up to 20 Foundry journal entries or pages/)
        expect(quest.reload.handouts).to eq(handouts)
      end
    end

    it 'deletes its encounters with it, each leaving a tombstone' do
      quest = create(:campaign_quest, campaign: campaign)
      encounter = create(:campaign_encounter, quest: quest)

      expect { delete "#{quests_path}/#{quest.id}" }.to change(CampaignEncounter, :count).by(-1)
      expect(response).to have_http_status(:no_content)
      expect(CampaignTombstone.where(record_type: 'CampaignEncounter').pluck(:record_uuid)).to eq([encounter.uuid])
    end

    it 'rejects a quest as its own parent' do
      quest = create(:campaign_quest, campaign: campaign)

      patch "#{quests_path}/#{quest.id}", params: { quest: { parent_id: quest.id } }, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
      expect(json['errors']).to include("Parent can't be this quest or one of its sub-quests")
    end
  end
end
