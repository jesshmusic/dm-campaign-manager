require 'rails_helper'

RSpec.describe CampaignImporter do
  let(:user) { create(:dungeon_master_user) }
  let(:importer) { described_class.new(user) }
  let(:brief) do
    { id: 'c1', name: 'Zombie Siege', premise: 'The dead rise', settingName: 'Greyhawk',
      truths: [{ name: 'The dead walk.', description: 'Nobody knows why.' }],
      mode: 'sandbox', startLevel: 3, targetLevel: 8, uuid: 'local-uuid', syncVersion: 0, local: true }
  end
  let(:scene) { { uuid: 'Scene.5wVcsNPOg2RjRbFx', name: 'The Crypt' } }
  let(:handout) { { uuid: 'JournalEntry.5wVcsNPOg2RjRbFx', name: 'A letter' } }
  let(:table) { { uuid: 'RollTable.5wVcsNPOg2RjRbFx', name: 'Crypt encounters' } }
  let(:records) do
    {
      factions: [{ id: 'f1', name: 'Cult of Nerull', goal: 'Raise the dead' }],
      references: [{ id: 'r1', name: 'Zombie', book: 'mm', category: 'monster', page: 340, challengeRating: '1/4',
                     foundryUuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000', citation: 'ignored' }],
      locations: [{ id: 'l1', name: 'The Crypt', features: ['Bone altar'], foundrySceneUuid: scene[:uuid],
                    foundrySceneName: 'The Crypt', foundryMapId: '99', rollTables: [table] }],
      npcs: [{ id: 'n1', name: 'Vex', role: 'bbeg', factionId: 'f1', statBlockReference: { id: 'r1', name: 'Zombie' },
               foundryActorUuid: 'Actor.Kz8rTq2LmN4pQw7X', foundryActorName: 'Vex', monster: nil }],
      fronts: [{ id: 'fr1', name: 'The Plague', npcId: 'n1', factionId: 'f1', stakes: ['Who survives?'],
                 portents: [{ text: 'Villages fall', triggered: true }], clockSegments: 6, clockFilled: 2 }],
      quests: [{ id: 'q1', name: 'Find the crypt', kind: 'main', status: 'active', giverNpcId: 'n1', locationId: 'l1',
                 foundryScenes: [scene], rewardCurrency: { gp: 50 }, rewardXp: 300, milestone: true, handouts: [handout] }],
      encounters: [{ id: 'e1', questId: 'q1', name: 'Ambush', kind: 'combat', description: 'At the gate', position: 0,
                     foundryScenes: [scene], rewardCurrency: { sp: 30 }, rewardXp: 100, syncVersion: 4 }],
      sessions: [{ id: 's1', number: 1, title: 'Outbreak', scheduledOn: '2026-11-01', level: 3, scenes: ['The village'],
                   treasureCurrency: { sp: 12 }, foundryScenes: [scene], displayTitle: 'ignored' }],
      secrets: [{ id: 'x1', text: 'The priest leads the cult', revelation: 'Who leads the cult', revealed: true,
                  revealedSessionId: 's1', revealedAt: '2020-01-01T00:00:00Z' }]
    }
  end

  def import(campaign = brief, sent = records, **options)
    importer.import!(campaign, sent, **options)
  end

  # The error messages from an import that should fail
  def errors_from(campaign = brief, sent = records)
    described_class.new(user).import!(campaign, sent)
    raise 'expected the import to fail'
  rescue described_class::Invalid => e
    e.errors
  end

  it 'creates the campaign from its brief, with no template records' do
    campaign = import(brief, nil)

    expect(campaign).to be_persisted
    expect(campaign).to have_attributes(user: user, name: 'Zombie Siege', premise: 'The dead rise', setting_name: 'Greyhawk',
                                        truths: [{ 'name' => 'The dead walk.', 'description' => 'Nobody knows why.' }],
                                        mode: 'sandbox', start_level: 3, target_level: 8)
    expect(campaign.uuid).not_to eq('local-uuid')
    expect([campaign.sessions, campaign.quests, campaign.fronts]).to all(be_empty)
    expect(importer.ids).to eq('c1' => campaign.uuid)
  end

  it 'takes truths written as strings, as older versions of the module send them' do
    campaign = import(brief.merge(truths: ['The dead walk. Nobody knows why.', 'Gold rules']), nil)

    expect(campaign.truths).to eq([{ 'name' => 'The dead walk.', 'description' => 'Nobody knows why.' },
                                   { 'name' => 'Gold rules', 'description' => '' }])
  end

  it "names the campaign's truth errors" do
    expect(errors_from(brief.merge(truths: [{ name: '', description: 'No name' }]), nil))
      .to eq(['Campaign: Each truth needs a name'])
  end

  it 'creates every record, pointing references at the new records' do
    campaign = import
    npc = campaign.npcs.sole
    session = campaign.sessions.sole

    expect(campaign.book_references.sole).to have_attributes(name: 'Zombie', page: 340, challenge_rating: '1/4')
    expect(campaign.locations.sole).to have_attributes(features: ['Bone altar'], foundry_scene_uuid: scene[:uuid], foundry_map_id: nil,
                                                       roll_tables: [table.stringify_keys])
    expect(npc).to have_attributes(role: 'bbeg', faction: campaign.factions.sole, stat_block_reference: campaign.book_references.sole,
                                   foundry_actor_uuid: 'Actor.Kz8rTq2LmN4pQw7X')
    expect(campaign.fronts.sole).to have_attributes(npc: npc, faction: campaign.factions.sole, stakes: ['Who survives?'],
                                                    portents: [{ 'text' => 'Villages fall', 'triggered' => true }], clock_filled: 2)
    expect(campaign.quests.sole).to have_attributes(giver_npc: npc, location: campaign.locations.sole, status: 'active',
                                                    foundry_scenes: [scene.stringify_keys], reward_currency: { 'gp' => 50 },
                                                    reward_xp: 300, milestone: true, handouts: [handout.stringify_keys])
    expect(campaign.encounters.sole).to have_attributes(quest: campaign.quests.sole, name: 'Ambush', kind: 'combat',
                                                        description: 'At the gate', foundry_scenes: [scene.stringify_keys],
                                                        reward_currency: { 'sp' => 30 }, reward_xp: 100)
    expect(session).to have_attributes(number: 1, title: 'Outbreak', scheduled_on: Date.new(2026, 11, 1), scenes: ['The village'],
                                       treasure_currency: { 'sp' => 12 })
    expect(campaign.secrets.sole).to have_attributes(revealed?: true, revealed_session: session)
  end

  it 'returns the new uuid of the campaign and every record by its local id' do
    campaign = import

    expect(importer.ids).to eq(
      'c1' => campaign.uuid, 'f1' => campaign.factions.sole.uuid, 'r1' => campaign.book_references.sole.uuid,
      'l1' => campaign.locations.sole.uuid, 'n1' => campaign.npcs.sole.uuid, 'fr1' => campaign.fronts.sole.uuid,
      'q1' => campaign.quests.sole.uuid, 'e1' => campaign.encounters.sole.uuid, 's1' => campaign.sessions.sole.uuid,
      'x1' => campaign.secrets.sole.uuid
    )
  end

  it 'gives everything a sync version, so a first pull returns it all' do
    campaign = import

    changes = CampaignSync.new(campaign).changes_since(0)

    expect(changes[:records].transform_values(&:size)).to eq(CampaignSync::COLLECTIONS.keys.index_with(1))
    expect(changes[:records].values.flatten.pluck(:syncVersion)).to all(be_positive)
    expect(changes[:cursor]).to eq(campaign.reload.sync_counter)
  end

  it 'sets the party' do
    akra = create(:player_character, user: user)

    expect(import(party_ids: [akra.id]).party).to eq([akra])
  end

  it "sets places' and quests' parents in a second pass, so a child can come first" do
    sent = { locations: [{ id: 'l2', name: 'Crypt', parentId: 'l1' }, { id: 'l1', name: 'Graveyard' }],
             quests: [{ id: 'q2', name: 'Open the tomb', parentId: 'q1' }, { id: 'q1', name: 'End the plague' }] }

    campaign = import(brief, sent)

    expect(campaign.locations.find_by(name: 'Crypt').parent).to eq(campaign.locations.find_by(name: 'Graveyard'))
    expect(campaign.quests.find_by(name: 'Open the tomb').parent).to eq(campaign.quests.find_by(name: 'End the plague'))
  end

  it 'creates session, quest and encounter links, with their quantities' do
    zombie = create(:monster, user: nil)
    wand = create(:magic_item, user: nil)
    records[:sessions].first[:links] = [
      { linkableType: 'CampaignSecret', linkableId: 'x1', position: 0 },
      { linkableType: 'CampaignLocation', linkableId: 'l1', position: 1 },
      { linkableType: 'CampaignNpc', linkableId: 'n1', position: 2 },
      { linkableType: 'CampaignQuest', linkableId: 'q1', position: 3 },
      { linkableType: 'CampaignFront', linkableId: 'fr1', position: 4 },
      { linkableType: 'CampaignReference', linkableId: 'r1', position: 5, quantity: 2 },
      { linkableType: 'Monster', linkableId: zombie.id.to_s, position: 6, quantity: 3, id: 'link1', name: 'ignored' },
      { linkableType: 'Item', linkableId: wand.id, quantity: 1 }
    ]
    records[:quests].first[:links] = [
      { linkableType: 'CampaignNpc', linkableId: 'n1', position: 0 },
      { linkableType: 'Item', linkableId: wand.id, position: 1, quantity: 2 }
    ]
    records[:encounters].first[:links] = [
      { linkableType: 'CampaignReference', linkableId: 'r1', position: 0, quantity: 4 },
      { linkableType: 'Monster', linkableId: zombie.id, position: 1 },
      { linkableType: 'CampaignNpc', linkableId: 'n1', position: 2 },
      { linkableType: 'Item', linkableId: wand.id, position: 3 }
    ]

    campaign = import

    expect(campaign.sessions.sole.links.map { |link| [link.linkable, link.position, link.quantity] }).to eq(
      [[campaign.secrets.sole, 0, nil], [campaign.locations.sole, 1, nil], [campaign.npcs.sole, 2, nil],
       [campaign.quests.sole, 3, nil], [campaign.fronts.sole, 4, nil], [campaign.book_references.sole, 5, 2],
       [zombie, 6, 3], [wand, 7, 1]]
    )
    expect(campaign.quests.sole.links.map { |link| [link.linkable, link.quantity] }).to eq([[campaign.npcs.sole, nil], [wand, 2]])
    expect(campaign.encounters.sole.links.map { |link| [link.linkable, link.quantity] }).to eq(
      [[campaign.book_references.sole, 4], [zombie, nil], [campaign.npcs.sole, nil], [wand, nil]]
    )
    expect(importer.ids).not_to have_key('link1')
  end

  it "rejects monsters on a quest: they go in its encounters" do
    records[:quests].first[:links] = [{ linkableType: 'Monster', linkableId: create(:monster, user: nil).id },
                                      { linkableType: 'CampaignReference', linkableId: 'r1' }]

    expect(errors_from).to eq(["Quests: Find the crypt: Monster can't be linked to a quest"])
  end

  it 'rejects a monster book reference on a quest' do
    records[:quests].first[:links] = [{ linkableType: 'CampaignReference', linkableId: 'r1' }]

    expect(errors_from).to eq(["Quests: Find the crypt: CampaignReference r1: Linkable is a monster: monsters go in the quest's encounters"])
  end

  it 'rejects an encounter without its quest' do
    records[:encounters] = [{ id: 'e1', name: 'Ambush', questId: 'nope' }, { id: 'e2', name: 'Lost' }]

    expect(errors_from).to contain_exactly('Encounters: Ambush: Quest must exist', 'Encounters: Lost: Quest must exist')
  end

  it "turns references to records that weren't sent into nil, and skips links to them" do
    sent = {
      npcs: [{ id: 'n1', name: 'Vex', factionId: 'nope', statBlockReferenceId: 'nope' }],
      quests: [{ id: 'q1', name: 'Find the crypt', giverNpcId: 'ghost', locationId: 'nope', parentId: 'nope',
                 links: [{ linkableType: 'CampaignNpc', linkableId: 'ghost' }, { linkableType: 'CampaignNpc', linkableId: 'n1' }] }],
      secrets: [{ id: 'x1', text: 'A clue', revealed: true, revealedSessionId: 'gone' }]
    }

    campaign = import(brief, sent)

    expect(campaign.npcs.sole).to have_attributes(faction: nil, stat_block_reference: nil)
    expect(campaign.quests.sole).to have_attributes(giver_npc: nil, location: nil, parent: nil)
    expect(campaign.quests.sole.links.map(&:linkable)).to eq([campaign.npcs.sole])
    expect(campaign.secrets.sole).to have_attributes(revealed?: true, revealed_session: nil)
  end

  it "keeps a column's default when it is sent as null, or as something it can't hold" do
    sent = { npcs: [{ id: 'n1', name: 'Vex', role: nil, voice: { pitch: 'low' } }],
             quests: [{ id: 'q1', name: 'Find the crypt', kind: nil, status: nil, position: nil, milestone: nil, foundryScenes: nil }],
             sessions: [{ id: 's1', number: 1, scheduledOn: 20_261_101, scenes: nil }] }

    campaign = import(brief.merge(truths: nil, mode: nil), sent)

    expect(campaign).to have_attributes(truths: [], mode: 'arc')
    expect(campaign.npcs.sole).to have_attributes(role: 'neutral', voice: nil)
    expect(campaign.quests.sole).to have_attributes(kind: 'main', status: 'available', position: 0, milestone: false, foundry_scenes: [])
    expect(campaign.sessions.sole).to have_attributes(scheduled_on: nil, scenes: [])
  end

  describe 'when something is not valid' do
    it 'saves nothing, and names the collection and record of each problem' do
      sent = { factions: [{ id: 'f1', name: 'Cult' }],
               fronts: [{ id: 'fr1', name: 'The Plague', portents: ['Villages fall'] }],
               quests: [{ id: 'q1', name: 'Find the crypt', kind: 'epic' }, { id: 'q2', name: '' }],
               sessions: [{ id: 's1', number: 1, level: 30 }] }

      expect(errors_from(brief, sent)).to eq(
        ['Fronts: The Plague: Portents must be up to 10 portents, each with text',
         'Quests: Find the crypt: Kind is not included in the list', "Quests: #2: Name can't be blank",
         'Sessions: Session 1: Level must be in 1..20']
      )
      expect(user.campaigns).to be_empty
      expect(CampaignFaction.count).to eq(0)
    end

    it 'reports the campaign' do
      expect(errors_from(brief.merge(name: ''), nil)).to eq(["Campaign: Name can't be blank"])
      expect(user.campaigns).to be_empty
    end

    it 'rejects a link to a monster the DM cannot use' do
      homebrew = create(:monster, user: create(:dungeon_master_user))
      records[:sessions].first[:links] = [{ linkableType: 'Monster', linkableId: homebrew.id }]

      expect(errors_from).to eq(["Sessions: Outbreak: Monster #{homebrew.id}: Linkable is not available to this campaign"])
      expect(user.campaigns).to be_empty
      expect(CampaignSessionLink.count).to eq(0)
    end

    it 'rejects parents that loop' do
      sent = { locations: [{ id: 'l1', name: 'Crypt', parentId: 'l2' }, { id: 'l2', name: 'Graveyard', parentId: 'l1' }] }

      expect(errors_from(brief, sent)).to eq(["Locations: Graveyard: Parent can't be this location or one inside it"])
    end
  end

  describe "checking the request's shape" do
    it 'needs a list of records for each collection' do
      expect(errors_from(brief, { quests: { id: 'q1' }, npcs: ['Vex'] })).to eq(
        ['NPCs must be a list of records', 'Quests must be a list of records']
      )
      expect(errors_from(brief, ['nope'])).to eq(['Records must be an object'])
      expect(errors_from('nope', nil)).to eq(['Campaign must be an object'])
    end

    it 'caps how many records a collection can send' do
      stub_const('CampaignImporter::MAX_RECORDS', 2)

      expect(errors_from(brief, { factions: Array.new(3) { |index| { id: "f#{index}", name: 'Cult' } } }))
        .to eq(['Factions: no more than 2 at a time'])
    end

    it 'caps how many links a record can have' do
      stub_const('CampaignImporter::MAX_LINKS', 1)
      records[:quests].first[:links] = Array.new(2) { { linkableType: 'CampaignNpc', linkableId: 'n1' } }

      expect(errors_from).to eq(['Quests: Find the crypt: Links: no more than 1'])
    end

    it 'needs each record to have its own id' do
      sent = { npcs: [{ name: 'Vex' }, { id: 'f1', name: 'Mira' }, { id: 'x' * 101, name: 'Long' }],
               factions: [{ id: 'f1', name: 'Cult' }], secrets: [{ id: 'c1', text: 'A clue' }] }

      expect(errors_from(brief, sent)).to eq(
        ["NPCs: Vex: Id can't be blank", 'NPCs: Mira: Id is used by another record',
         'NPCs: Long: Id is too long (maximum is 100 characters)', 'Secrets: A clue: Id is used by another record']
      )
    end

    it 'allows only the link types a session or quest can have' do
      records[:quests].first[:links] = [{ linkableType: 'CampaignSecret', linkableId: 'x1' }, { linkableId: 'n1' }]
      records[:sessions].first[:links] = [{ linkableType: 'Spell', linkableId: 1 }]

      expect(errors_from).to eq(
        ["Quests: Find the crypt: CampaignSecret can't be linked to a quest", 'Quests: Find the crypt: Links need a linkableType',
         "Sessions: Outbreak: Spell can't be linked to a session"]
      )
      expect(user.campaigns).to be_empty
    end
  end
end
