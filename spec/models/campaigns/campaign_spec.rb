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

    def truth(name, description = '')
      { 'name' => name, 'description' => description }
    end

    it 'accepts up to 20 truths, each with a name and a description' do
      expect(Campaign::MAX_TRUTHS).to eq(20)
      expect(build(:campaign, truths: Array.new(20) { |i| truth("Truth #{i}.", 'Everyone knows it.') })).to be_valid
    end

    it 'has no rule of six' do
      expect(build(:campaign, truths: Array.new(7) { |i| truth("Truth #{i}") })).to be_valid
    end

    it 'rejects more than 20 truths' do
      campaign = build(:campaign, truths: Array.new(21) { |i| truth("Truth #{i}") })

      expect(campaign).not_to be_valid
      expect(campaign.errors.full_messages).to eq(['A campaign can have up to 20 truths'])
    end

    it 'needs a name for each truth that has a description' do
      campaign = build(:campaign, truths: [truth('Fine'), { name: '  ', description: 'The temple is corrupt' }])

      expect(campaign).not_to be_valid
      expect(campaign.errors.attribute_names).to eq([:truths])
      expect(campaign.errors.full_messages).to eq(['Each truth needs a name'])
    end

    it 'limits the name to 120 characters and the description to 1000, after trimming' do
      expect(build(:campaign, truths: [truth("  #{'a' * 120}  ", 'b' * 1000)])).to be_valid

      campaign = build(:campaign, truths: [truth('a' * 121, 'b' * 1001)])

      expect(campaign).not_to be_valid
      expect(campaign.errors.full_messages).to contain_exactly(
        "A truth's name is too long (maximum is 120 characters)",
        "A truth's description is too long (maximum is 1000 characters)"
      )
    end

    it 'rejects truths that are not a list of names and descriptions' do
      message = 'Truths must be a list, each with a name and a description'

      [['Fine', 3], { 'a' => 'b' }, 'Magic is rare', [{ name: 5 }], [{ name: 'Fine', description: ['x'] }]].each do |truths|
        campaign = build(:campaign, truths: truths)
        expect(campaign).not_to be_valid, "expected #{truths.inspect} to be invalid"
        expect(campaign.errors.full_messages).to eq([message])
      end
    end

    it 'keeps truths in the shape it stores, from objects or older strings' do
      campaign = create(:campaign, truths: ['Greyhawk runs on gold. Nearly anything can be bought.',
                                            { name: ' The city has walls within walls. ', description: nil, extra: 'x' }])

      expect(campaign.reload.truths).to eq([
                                             truth('Greyhawk runs on gold.', 'Nearly anything can be bought.'),
                                             truth('The city has walls within walls.')
                                           ])
    end

    it 'still saves other changes to a campaign whose truths came from before the limits' do
      campaign = create(:campaign)
      campaign.update_column(:truths, [truth('a' * 200)])

      expect(campaign.reload.update(pitch: 'A new pitch')).to be(true)
      expect(campaign.update(truths: campaign.truths + [truth('One more')])).to be(false)
    end

    it 'does not count saving the same truths again as a change' do
      campaign = create(:campaign, truths: [truth('The dead walk.', 'Nobody knows why.')])

      campaign.assign_attributes(truths: [{ name: 'The dead walk.', description: 'Nobody knows why.' }])

      expect(campaign.truths_changed?).to be(false)
    end

    it 'uses every compendium unless some are excluded' do
      expect(build(:campaign).excluded_compendium_packs).to eq([])
      expect(build(:campaign, excluded_compendium_packs: ['dnd5e.actors24'])).to be_valid
    end

    it 'can exclude homebrew compendiums, which the DM may have in another world' do
      expect(build(:campaign, excluded_compendium_packs: ['world-actors.greyhawk', 'world.my-monsters', 'some_module.monsters'])).to be_valid
    end

    it 'only excludes compendium ids' do
      ['world', 'world.my.monsters', 'world.my monsters', 'x' * 101, 5].each do |pack|
        campaign = build(:campaign, excluded_compendium_packs: [pack])

        expect(campaign).not_to be_valid, "expected #{pack.inspect} to be rejected"
        expect(campaign.errors[:excluded_compendium_packs]).to include('must be a list of supported compendiums')
      end
      expect(build(:campaign, excluded_compendium_packs: 'dnd5e.actors24')).not_to be_valid
      expect(build(:campaign, excluded_compendium_packs: Array.new(201) { |i| "world.pack#{i}" })).not_to be_valid
    end
  end

  describe '.normalize_truths' do
    def normalize(value)
      described_class.normalize_truths(value)
    end

    it 'splits a string after its first sentence, keeping the punctuation on the name' do
      expect(normalize(['Greyhawk runs on gold. The Directing Oligarchy governs.'])).to eq(
        [{ 'name' => 'Greyhawk runs on gold.', 'description' => 'The Directing Oligarchy governs.' }]
      )
    end

    it 'splits after "!" or "?" too, and only at the first sentence end' do
      expect(normalize(['The dead walk! Nobody knows why. The priests say a curse.', 'Who rules? Gold does.'])).to eq(
        [{ 'name' => 'The dead walk!', 'description' => 'Nobody knows why. The priests say a curse.' },
         { 'name' => 'Who rules?', 'description' => 'Gold does.' }]
      )
    end

    it 'keeps a string with no sentence end, or one ending the string, as the whole name' do
      expect(normalize(['No punctuation here', '  The dead walk.  ', 'e.g.no space'])).to eq(
        [{ 'name' => 'No punctuation here', 'description' => '' },
         { 'name' => 'The dead walk.', 'description' => '' },
         { 'name' => 'e.g.no space', 'description' => '' }]
      )
    end

    it 'splits at a sentence end followed by a new line or extra spaces' do
      expect(normalize(["The dead walk.\n  Nobody knows why", 'Wait... what'])).to eq(
        [{ 'name' => 'The dead walk.', 'description' => 'Nobody knows why' }, { 'name' => 'Wait...', 'description' => 'what' }]
      )
    end

    it 'trims objects, with string or symbol keys, and keeps only the name and description' do
      expect(normalize([{ name: ' Gold rules ', description: ' Everything is for sale ', id: 3 },
                        { 'name' => 'Walls', 'description' => nil }, { 'name' => 'Gates' }])).to eq(
                          [{ 'name' => 'Gold rules', 'description' => 'Everything is for sale' },
                           { 'name' => 'Walls', 'description' => '' },
                           { 'name' => 'Gates', 'description' => '' }]
                        )
    end

    it 'takes a mix of strings and objects, in order' do
      expect(normalize(['First. One', { name: 'Second', description: 'Two' }, 'Third'])).to eq(
        [{ 'name' => 'First.', 'description' => 'One' }, { 'name' => 'Second', 'description' => 'Two' },
         { 'name' => 'Third', 'description' => '' }]
      )
    end

    it 'takes request parameters' do
      params = ActionController::Parameters.new(name: 'Gold rules', description: 'All of it')

      expect(normalize([params])).to eq([{ 'name' => 'Gold rules', 'description' => 'All of it' }])
    end

    it 'drops empty truths, keeping one with only a description for validation to reject' do
      expect(normalize(['', '  ', nil, { name: ' ', description: '' }, { name: '', description: 'Orphan' }])).to eq(
        [{ 'name' => '', 'description' => 'Orphan' }]
      )
    end

    it 'is no truths for nil' do
      expect(normalize(nil)).to eq([])
      expect(normalize([])).to eq([])
    end

    it 'leaves what is not a list of truths for validation to reject' do
      expect(normalize('Magic is rare')).to eq('Magic is rare')
      expect(normalize([3, { name: 5 }])).to eq([3, { 'name' => 5, 'description' => '' }])
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
      create(:campaign_quest_link, quest: quest, linkable: create(:campaign_reference, campaign: campaign, category: 'rule'))
      encounter = create(:campaign_encounter, quest: quest)
      create(:campaign_encounter_link, encounter: encounter, linkable: create(:campaign_reference, campaign: campaign))
      npc.destroy! # leaves a tombstone

      campaign.destroy!

      [CampaignFaction, CampaignLocation, CampaignNpc, CampaignFront, CampaignQuest, CampaignSecret, CampaignSession,
       CampaignSessionLink, CampaignQuestLink, CampaignEncounter, CampaignEncounterLink, CampaignReference,
       CampaignTombstone].each do |model|
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
                                   start_level: 1, target_level: 10, party_size: 4,
                                   truths: [{ name: 'Magic is rare.', description: 'Wizards hide.' }])

      expect(campaign.as_json_for_api).to include(
        id: campaign.id.to_s, uuid: campaign.uuid, slug: 'storm-king', name: 'Storm King', settingName: 'Faerûn',
        truths: [{ 'name' => 'Magic is rare.', 'description' => 'Wizards hide.' }], mode: 'arc', status: 'planning', plannedSessions: 8, partySize: 4,
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
      create(:campaign_quest_link, quest: quest, linkable: create(:magic_item, user: nil, name: 'Bag of Holding'))

      expect(campaign.as_full_json_for_api[:quests].sole[:links].pluck(:name)).to eq(['Bag of Holding'])
    end

    it 'includes the encounters, by quest and in order, with their links' do
      quest = create(:campaign_quest, campaign: campaign)
      later = create(:campaign_encounter, quest: quest, name: 'The lair', position: 1)
      sooner = create(:campaign_encounter, quest: quest, name: 'Ambush', position: 0)
      create(:campaign_encounter_link, encounter: later, linkable: create(:monster, user: nil, name: 'Owlbear'), quantity: 2)
      create(:campaign_encounter, quest: create(:campaign_quest), name: 'Elsewhere')

      encounters = campaign.as_full_json_for_api[:encounters]

      expect(encounters.pluck(:name)).to eq(['Ambush', 'The lair'])
      expect(encounters.pluck(:questId).uniq).to eq([quest.id.to_s])
      expect(encounters.last[:links].map { |link| link.slice(:name, :quantity) }).to eq([{ name: 'Owlbear', quantity: 2 }])
      expect(encounters.first[:id]).to eq(sooner.id.to_s)
    end
  end

  describe '#foundry_scene_uuids' do
    def scene(uuid, name = 'Map')
      { 'uuid' => uuid, 'name' => name }
    end

    it "lists each place's map and each session's, quest's and encounter's maps, once each" do
      create(:campaign_location, campaign: campaign, foundry_scene_uuid: 'Scene.aaaaaaaaaaaaaaaa')
      create(:campaign_location, campaign: campaign)
      create(:campaign_session, campaign: campaign, foundry_scenes: [scene('Scene.bbbbbbbbbbbbbbbb'), scene('Scene.aaaaaaaaaaaaaaaa')])
      quest = create(:campaign_quest, campaign: campaign,
                                      foundry_scenes: [scene('Scene.cccccccccccccccc'), scene('Scene.bbbbbbbbbbbbbbbb')])
      create(:campaign_encounter, quest: quest, foundry_scenes: [scene('Scene.eeeeeeeeeeeeeeee'), scene('Scene.cccccccccccccccc')])
      create(:campaign_quest, campaign: create(:campaign), foundry_scenes: [scene('Scene.dddddddddddddddd')])

      expect(campaign.foundry_scene_uuids).to contain_exactly('Scene.aaaaaaaaaaaaaaaa', 'Scene.bbbbbbbbbbbbbbbb',
                                                              'Scene.cccccccccccccccc', 'Scene.eeeeeeeeeeeeeeee')
    end

    it 'is empty without maps' do
      expect(campaign.foundry_scene_uuids).to eq([])
    end
  end
end
