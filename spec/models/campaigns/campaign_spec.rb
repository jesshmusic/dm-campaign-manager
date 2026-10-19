require 'rails_helper'

RSpec.describe Campaign, type: :model do
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) { create(:campaign, user: user) }

  describe 'factory' do
    it 'is valid' do
      expect(build(:campaign)).to be_valid
    end
  end

  describe 'validations' do
    subject { build(:campaign, user: user) }

    it { is_expected.to validate_presence_of(:name) }
    it { is_expected.to validate_length_of(:name).is_at_most(120) }
    it { is_expected.to validate_inclusion_of(:mode).in_array(Campaign::MODES) }
    it { is_expected.to validate_inclusion_of(:status).in_array(Campaign::STATUSES) }
    it { is_expected.to validate_inclusion_of(:edition).in_array([Campaign::EDITION]) }

    it 'only allows the 2024 rules' do
      expect(build(:campaign, edition: '2014')).not_to be_valid
    end

    it 'requires a user' do
      expect(build(:campaign, user: nil)).not_to be_valid
    end

    it 'defaults to an arc in planning for the 2024 rules' do
      expect(subject).to have_attributes(mode: 'arc', status: 'planning', edition: '2024', truths: [])
    end

    %i[start_level target_level].each do |attribute|
      it "allows #{attribute} from 1 to 20 or blank" do
        [nil, 1, 20].each do |value|
          subject.assign_attributes(start_level: nil, target_level: nil, attribute => value)
          expect(subject).to be_valid, "expected #{attribute}=#{value.inspect} to be valid"
        end
        [0, 21, 2.5].each do |value|
          subject.assign_attributes(start_level: nil, target_level: nil, attribute => value)
          expect(subject).not_to be_valid, "expected #{attribute}=#{value.inspect} to be invalid"
        end
      end
    end

    it 'allows planned_sessions from 1 to 100 or blank' do
      expect(build(:campaign, planned_sessions: nil)).to be_valid
      expect(build(:campaign, planned_sessions: 100)).to be_valid
      expect(build(:campaign, planned_sessions: 0)).not_to be_valid
      expect(build(:campaign, planned_sessions: 101)).not_to be_valid
    end

    it 'allows party_size from 1 to 12 or blank' do
      expect(build(:campaign, party_size: nil)).to be_valid
      expect(build(:campaign, party_size: 12)).to be_valid
      expect(build(:campaign, party_size: 0)).not_to be_valid
      expect(build(:campaign, party_size: 13)).not_to be_valid
    end

    it 'rejects a target level below the starting level' do
      campaign = build(:campaign, start_level: 5, target_level: 3)

      expect(campaign).not_to be_valid
      expect(campaign.errors[:target_level]).to include("can't be lower than the starting level")
    end

    it 'allows a target level equal to the starting level' do
      expect(build(:campaign, start_level: 5, target_level: 5)).to be_valid
    end

    it 'accepts up to six truths as strings' do
      expect(Campaign::MAX_TRUTHS).to eq(6)
      expect(build(:campaign, truths: Array.new(6) { |i| "Truth #{i}" })).to be_valid
    end

    it 'rejects too many truths' do
      campaign = build(:campaign, truths: Array.new(7) { |i| "Truth #{i}" })

      expect(campaign).not_to be_valid
      expect(campaign.errors[:truths]).to include('must be a list of up to 6 statements')
    end

    it 'still saves other changes to a campaign that has more truths from before' do
      campaign = create(:campaign)
      campaign.update_column(:truths, Array.new(8) { |i| "Truth #{i}" })

      expect(campaign.reload.update(pitch: 'A new pitch')).to be(true)
      expect(campaign.update(truths: campaign.truths + ['One more'])).to be(false)
    end

    it 'rejects truths that are not strings or not a list' do
      expect(build(:campaign, truths: ['Fine', 3])).not_to be_valid
      expect(build(:campaign, truths: { 'a' => 'b' })).not_to be_valid
    end

    it 'uses every compendium unless some are excluded' do
      expect(build(:campaign).excluded_compendium_packs).to eq([])
      expect(build(:campaign, excluded_compendium_packs: ['dnd5e.actors24'])).to be_valid
    end

    it 'only excludes compendiums it knows' do
      campaign = build(:campaign, excluded_compendium_packs: ['world.homebrew'])

      expect(campaign).not_to be_valid
      expect(campaign.errors[:excluded_compendium_packs]).to include('must be a list of supported compendiums')
      expect(build(:campaign, excluded_compendium_packs: 'dnd5e.actors24')).not_to be_valid
    end
  end

  describe '#assign_party!' do
    it "sets the party to the DM's chosen characters" do
      akra = create(:player_character, user: campaign.user, name: 'Akra')
      borin = create(:player_character, user: campaign.user, name: 'Borin')

      campaign.assign_party!([akra.id, borin.id])
      expect(campaign.party.reload).to contain_exactly(akra, borin)

      campaign.assign_party!([borin.id.to_s])
      expect(campaign.party.reload).to eq([borin])

      campaign.assign_party!([])
      expect(campaign.party.reload).to be_empty
    end

    it "ignores another DM's characters" do
      campaign.assign_party!([create(:player_character).id])

      expect(campaign.party.reload).to be_empty
    end

    it 'leaves the characters when the campaign is deleted' do
      akra = create(:player_character, user: campaign.user)
      campaign.assign_party!([akra.id])

      campaign.destroy!

      expect(akra.reload).to be_persisted
    end
  end

  describe 'slugs' do
    it 'generates a slug from the name' do
      expect(create(:campaign, user: user, name: 'Curse of the Lich').slug).to eq('curse-of-the-lich')
    end

    it 'scopes slugs per user so two DMs can both have "My Campaign"' do
      mine = create(:campaign, user: user, name: 'My Campaign')
      theirs = create(:campaign, user: create(:dungeon_master_user), name: 'My Campaign')

      expect(mine.slug).to eq('my-campaign')
      expect(theirs.slug).to eq('my-campaign')
    end

    it "keeps one user's slugs unique" do
      first = create(:campaign, user: user, name: 'My Campaign')
      second = create(:campaign, user: user, name: 'My Campaign')

      expect(second.slug).not_to eq(first.slug)
      expect(second.slug).to start_with('my-campaign-')
    end

    it 'is found by slug within the owner' do
      campaign = create(:campaign, user: user, name: 'Storm King')

      expect(user.campaigns.friendly.find('storm-king')).to eq(campaign)
      expect { create(:dungeon_master_user).campaigns.friendly.find('storm-king') }
        .to raise_error(ActiveRecord::RecordNotFound)
    end

    it 'keeps the slug when the campaign is renamed' do
      campaign = create(:campaign, user: user, name: 'Working Title')
      campaign.update!(name: 'Final Title')

      expect(campaign.reload.slug).to eq('working-title')
    end

    it 'allows names that are FriendlyId reserved words' do
      %w[New Session Admin].each do |name|
        campaign = build(:campaign, user: user, name: name)

        expect(campaign).to be_valid, "expected #{name} to be valid: #{campaign.errors.full_messages}"
        campaign.save!
        expect(campaign.slug).to start_with("#{name.downcase}-")
      end
    end
  end

  describe 'sync bookkeeping' do
    it 'assigns a uuid on create' do
      expect(campaign.uuid).to match(/\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/)
    end

    it 'keeps a uuid it was given' do
      uuid = SecureRandom.uuid

      expect(create(:campaign, uuid: uuid).uuid).to eq(uuid)
    end

    it 'starts at sync version 0' do
      expect(campaign.sync_version).to eq(0)
      expect(campaign.reload.sync_counter).to eq(0)
    end

    describe '#next_sync_version!' do
      it 'bumps and returns the counter' do
        expect(campaign.next_sync_version!).to eq(1)
        expect(campaign.next_sync_version!).to eq(2)
        expect(campaign.reload.sync_counter).to eq(2)
      end

      it 'marks the campaign updated so the list sorts by recent activity' do
        campaign.update_column(:updated_at, 1.day.ago)

        freeze_time do
          create(:campaign_npc, campaign: campaign)
          expect(campaign.reload.updated_at).to eq(Time.current)
        end
      end

      it 'keeps a separate counter per campaign' do
        other = create(:campaign)
        campaign.next_sync_version!
        campaign.next_sync_version!

        expect(other.next_sync_version!).to eq(1)
      end
    end

    it 'takes a new sync version on every update' do
      campaign.update!(name: 'Renamed')
      first = campaign.sync_version
      campaign.update!(premise: 'A premise')

      expect(first).to be_positive
      expect(campaign.sync_version).to be > first
      expect(campaign.reload.sync_version).to eq(campaign.reload.sync_counter)
    end

    it 'shares the counter with its records' do
      faction = create(:campaign_faction, campaign: campaign)
      campaign.update!(name: 'Renamed')

      expect(campaign.sync_version).to be > faction.sync_version
    end
  end

  describe 'associations' do
    it 'is destroyed with its user' do
      campaign

      expect { user.destroy }.to change(described_class, :count).by(-1)
    end

    it 'destroys all of its records with it' do
      session = create(:campaign_session, campaign: campaign)
      npc = create(:campaign_npc, campaign: campaign, faction: create(:campaign_faction, campaign: campaign))
      parent = create(:campaign_location, campaign: campaign)
      create(:campaign_location, campaign: campaign, parent: parent)
      create(:campaign_front, campaign: campaign, npc: npc)
      create(:campaign_quest, campaign: campaign, giver_npc: npc, location: parent)
      create(:campaign_secret, campaign: campaign, revealed: true, revealed_session: session)
      create(:campaign_session_link, session: session, linkable: npc)
      quest = create(:campaign_quest, campaign: campaign)
      create(:campaign_quest_link, quest: quest, linkable: create(:campaign_npc, campaign: campaign))
      create(:campaign_quest_link, quest: quest, linkable: create(:campaign_reference, campaign: campaign))
      npc.destroy! # leaves a tombstone

      campaign.destroy!

      [CampaignFaction, CampaignLocation, CampaignNpc, CampaignFront, CampaignQuest, CampaignSecret, CampaignSession,
       CampaignSessionLink, CampaignQuestLink, CampaignReference, CampaignTombstone].each do |model|
        expect(model.count).to eq(0), "expected no #{model.name} records left"
      end
    end
  end

  describe '#revelation_summaries' do
    it 'counts clues and revealed clues per revelation' do
      3.times { create(:campaign_secret, campaign: campaign, revelation: 'The duke is a vampire') }
      create(:campaign_secret, campaign: campaign, revelation: 'The duke is a vampire', revealed: true)
      create(:campaign_secret, campaign: campaign, revelation: 'The map is fake', revealed: true)
      create(:campaign_secret, campaign: campaign, revelation: nil)
      create(:campaign_secret, campaign: campaign, revelation: '')
      create(:campaign_secret, revelation: 'The duke is a vampire') # another campaign

      expect(campaign.revelation_summaries).to contain_exactly(
        { name: 'The duke is a vampire', clueCount: 4, revealedCount: 1 },
        { name: 'The map is fake', clueCount: 1, revealedCount: 1 }
      )
    end

    it 'is empty without revelations' do
      create(:campaign_secret, campaign: campaign)

      expect(campaign.revelation_summaries).to eq([])
    end
  end

  describe '#upcoming_session' do
    it 'is the lowest-numbered session not yet played' do
      create(:campaign_session, campaign: campaign, number: 1, status: 'played')
      third = create(:campaign_session, campaign: campaign, number: 3, status: 'planned')
      second = create(:campaign_session, campaign: campaign, number: 2, status: 'prepped')

      expect(campaign.upcoming_session).to eq(second)
      second.update!(status: 'played')
      expect(campaign.reload.upcoming_session).to eq(third)
    end

    it 'is nil when every session has been played' do
      create(:campaign_session, campaign: campaign, status: 'played')

      expect(campaign.upcoming_session).to be_nil
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the campaign in camelCase' do
      campaign = create(:campaign, user: user, name: 'Storm King', planned_sessions: 8, setting_name: 'Faerûn',
                                   start_level: 1, target_level: 10, party_size: 4, truths: ['Magic is rare'])

      expect(campaign.as_json_for_api).to include(
        id: campaign.id.to_s, uuid: campaign.uuid, slug: 'storm-king', name: 'Storm King', settingName: 'Faerûn',
        truths: ['Magic is rare'], mode: 'arc', status: 'planning', plannedSessions: 8, partySize: 4,
        startLevel: 1, targetLevel: 10, edition: '2024', createdAt: campaign.created_at.iso8601
      )
    end
  end

  describe '#as_summary_json_for_api' do
    it 'includes the session count, next session and clocks' do
      create(:campaign_session, campaign: campaign, number: 1, status: 'played')
      next_session = create(:campaign_session, campaign: campaign, number: 2, title: 'Into the Crypt',
                                               scheduled_on: Date.new(2026, 11, 1))
      older = create(:campaign_front, campaign: campaign, name: 'Cult', clock_segments: 8, clock_filled: 3,
                                      created_at: 2.days.ago)
      newer = create(:campaign_front, campaign: campaign, name: 'Dragon', clock_segments: 4, created_at: 1.day.ago)

      json = campaign.as_summary_json_for_api

      expect(json[:sessionCount]).to eq(2)
      expect(json[:nextSession]).to eq(id: next_session.id.to_s, number: 2, displayTitle: 'Into the Crypt',
                                        scheduledOn: '2026-11-01', status: 'planned')
      expect(json[:clocks]).to eq([
                                    { id: older.id.to_s, name: 'Cult', clockSegments: 8, clockFilled: 3 },
                                    { id: newer.id.to_s, name: 'Dragon', clockSegments: 4, clockFilled: 0 }
                                  ])
    end

    it 'falls back to a numbered title and has no next session when all are played' do
      create(:campaign_session, campaign: campaign, number: 1)
      expect(campaign.as_summary_json_for_api[:nextSession][:displayTitle]).to eq('Session 1')

      campaign.sessions.first.update!(status: 'played')
      expect(campaign.reload.as_summary_json_for_api).to include(nextSession: nil, clocks: [])
    end
  end

  describe '#as_full_json_for_api' do
    it 'includes every collection and the revelations' do
      create(:campaign_faction, campaign: campaign, name: 'Zhentarim')
      create(:campaign_location, campaign: campaign, name: 'Phandalin')
      create(:campaign_npc, campaign: campaign, name: 'Sildar')
      create(:campaign_front, campaign: campaign, name: 'Black Spider')
      create(:campaign_quest, campaign: campaign, name: 'Find the mine')
      create(:campaign_secret, campaign: campaign, text: 'The spider is a drow', revelation: 'Spider')
      session = create(:campaign_session, campaign: campaign, title: 'Goblin Arrows')
      create(:campaign_session_link, session: session, linkable: campaign.npcs.first)

      json = campaign.as_full_json_for_api

      expect(json[:factions].pluck(:name)).to eq(['Zhentarim'])
      expect(json[:locations].pluck(:name)).to eq(['Phandalin'])
      expect(json[:npcs].pluck(:name)).to eq(['Sildar'])
      expect(json[:fronts].pluck(:name)).to eq(['Black Spider'])
      expect(json[:quests].pluck(:name)).to eq(['Find the mine'])
      expect(json[:secrets].pluck(:text)).to eq(['The spider is a drow'])
      expect(json[:sessions].pluck(:title)).to eq(['Goblin Arrows'])
      expect(json[:sessions].first[:links].pluck(:name)).to eq(['Sildar'])
      expect(json[:revelations]).to eq([{ name: 'Spider', clueCount: 1, revealedCount: 0 }])
    end

    it 'orders sessions by number' do
      create(:campaign_session, campaign: campaign, number: 2)
      create(:campaign_session, campaign: campaign, number: 1)

      expect(campaign.as_full_json_for_api[:sessions].pluck(:number)).to eq([1, 2])
    end

    it "includes each quest's links" do
      quest = create(:campaign_quest, campaign: campaign)
      create(:campaign_quest_link, quest: quest, linkable: create(:monster, user: nil, name: 'Owlbear'))

      expect(campaign.as_full_json_for_api[:quests].sole[:links].pluck(:name)).to eq(['Owlbear'])
    end
  end

  describe '#foundry_scene_uuids' do
    def scene(uuid, name = 'Map')
      { 'uuid' => uuid, 'name' => name }
    end

    it "lists each place's map and each session's and quest's maps, once each" do
      create(:campaign_location, campaign: campaign, foundry_scene_uuid: 'Scene.aaaaaaaaaaaaaaaa')
      create(:campaign_location, campaign: campaign)
      create(:campaign_session, campaign: campaign, foundry_scenes: [scene('Scene.bbbbbbbbbbbbbbbb'), scene('Scene.aaaaaaaaaaaaaaaa')])
      create(:campaign_quest, campaign: campaign, foundry_scenes: [scene('Scene.cccccccccccccccc'), scene('Scene.bbbbbbbbbbbbbbbb')])
      create(:campaign_quest, campaign: create(:campaign), foundry_scenes: [scene('Scene.dddddddddddddddd')])

      expect(campaign.foundry_scene_uuids).to contain_exactly('Scene.aaaaaaaaaaaaaaaa', 'Scene.bbbbbbbbbbbbbbbb',
                                                              'Scene.cccccccccccccccc')
    end

    it 'is empty without maps' do
      expect(campaign.foundry_scene_uuids).to eq([])
    end
  end
end
