require 'rails_helper'

RSpec.describe CampaignOutlineApplier do
  let(:campaign) { create(:campaign, start_level: 3, truths: ['Magic is fading']) }
  let(:full_outline) do
    {
      'pitch' => 'Find the stolen crown',
      'truths' => ['The gods are silent'],
      'factions' => [{ 'name' => 'Iron Hand' }],
      'npcs' => [{ 'name' => 'Vex' }],
      'fronts' => [{ 'name' => 'The Usurper' }],
      'locations' => [{ 'name' => 'Frostgate' }],
      'quests' => [{ 'name' => 'Recover the crown' }],
      'secrets' => [{ 'text' => 'Vex forged the letter' }],
      'sessions' => [{ 'number' => 1, 'title' => 'The Heist' }]
    }
  end

  def apply(outline, sections: described_class::SECTIONS)
    described_class.apply!(campaign, outline, sections: sections)
  end

  def record_counts
    [campaign.factions, campaign.npcs, campaign.fronts, campaign.locations, campaign.quests, campaign.secrets,
     campaign.sessions].map(&:count)
  end

  it 'returns the reloaded campaign' do
    result = apply({ 'pitch' => 'Find the stolen crown' })

    expect(result).to eq(campaign)
    expect(result.pitch).to eq('Find the stolen crown')
  end

  describe 'sections' do
    it 'applies every section by default' do
      described_class.apply!(campaign, full_outline)

      expect(campaign.pitch).to eq('Find the stolen crown')
      expect(campaign.truths).to eq(['Magic is fading', 'The gods are silent'])
      expect(campaign.factions.pluck(:name)).to eq(['Iron Hand'])
      expect(campaign.npcs.pluck(:name)).to eq(['Vex'])
      expect(campaign.fronts.pluck(:name)).to eq(['The Usurper'])
      expect(campaign.locations.pluck(:name)).to eq(['Frostgate'])
      expect(campaign.quests.pluck(:name)).to eq(['Recover the crown'])
      expect(campaign.secrets.pluck(:text)).to eq(['Vex forged the letter'])
      expect(campaign.sessions.pluck(:title)).to eq(['The Heist'])
    end

    it 'applies only the approved sections' do
      apply(full_outline, sections: %w[npcs locations])

      expect(campaign.pitch).to be_nil
      expect(campaign.truths).to eq(['Magic is fading'])
      expect(campaign.npcs.pluck(:name)).to eq(['Vex'])
      expect(campaign.locations.pluck(:name)).to eq(['Frostgate'])
      expect([campaign.factions, campaign.fronts, campaign.quests, campaign.secrets, campaign.sessions]).to all(be_empty)
    end

    it 'ignores unknown sections and keys' do
      outline = full_outline.merge('name' => 'Hijacked', 'user_id' => create(:user).id, 'monsters' => [{ 'name' => 'Owlbear' }])

      apply(outline, sections: %w[pitch name user_id monsters destroy])

      expect(campaign.pitch).to eq('Find the stolen crown')
      expect(campaign.name).not_to eq('Hijacked')
      expect(campaign.user_id).not_to eq(outline['user_id'])
      expect(record_counts).to all(eq(0))
    end

    it 'changes nothing when no sections are approved' do
      expect { apply(full_outline, sections: []) }.not_to(change { campaign.reload.attributes })
      expect(record_counts).to all(eq(0))
    end
  end

  describe 'input' do
    it 'accepts symbol keys' do
      apply({ pitch: 'Symbols', npcs: [{ name: 'Vex', role: 'ally' }] })

      expect(campaign.pitch).to eq('Symbols')
      expect(campaign.npcs.sole).to have_attributes(name: 'Vex', role: 'ally')
    end

    it 'accepts unpermitted ActionController::Parameters' do
      params = ActionController::Parameters.new(
        'pitch' => 'From the browser',
        'factions' => [{ 'name' => 'Iron Hand' }],
        'npcs' => [{ 'name' => 'Vex', 'role' => 'bbeg', 'faction' => 'Iron Hand' }],
        'fronts' => [{ 'name' => 'The Usurper', 'leader' => 'Vex', 'portents' => ['Crows gather'] }]
      )

      apply(params)

      expect(campaign.pitch).to eq('From the browser')
      expect(campaign.npcs.sole.faction).to eq(campaign.factions.sole)
      expect(campaign.fronts.sole).to have_attributes(npc: campaign.npcs.sole,
                                                      portents: [{ 'text' => 'Crows gather', 'triggered' => false }])
    end

    it 'skips list entries that are not objects' do
      apply({ 'factions' => ['Iron Hand', nil, 42, ['Nested'], { 'name' => 'Real Faction' }] })

      expect(campaign.factions.pluck(:name)).to eq(['Real Faction'])
    end

    it 'ignores sections that are not lists of objects' do
      apply({ 'factions' => 'Iron Hand', 'npcs' => { 'name' => 'Vex' }, 'locations' => nil })

      expect(record_counts).to all(eq(0))
    end
  end

  describe 'pitch' do
    it 'sets the trimmed pitch' do
      apply({ 'pitch' => "  Find the stolen crown \n" }, sections: %w[pitch])

      expect(campaign.pitch).to eq('Find the stolen crown')
    end

    it 'caps the pitch at 2000 characters' do
      apply({ 'pitch' => 'a' * 2500 }, sections: %w[pitch])

      expect(campaign.pitch.length).to eq(2000)
    end

    it 'keeps the existing pitch when the outline has none' do
      campaign.update!(pitch: 'Written by the DM')

      apply({ 'pitch' => '   ' }, sections: %w[pitch])
      apply({}, sections: %w[pitch])

      expect(campaign.pitch).to eq('Written by the DM')
    end
  end

  describe 'truths' do
    it 'adds new truths after the existing ones, trimmed and without duplicates' do
      apply({ 'truths' => ['Magic is fading', '  The gods are silent ', '', nil, 42, 'The gods are silent'] },
            sections: %w[truths])

      expect(campaign.truths).to eq(['Magic is fading', 'The gods are silent', '42'])
    end

    it 'caps the total at Campaign::MAX_TRUTHS, keeping the existing truths' do
      existing = Array.new(10) { |i| "Existing #{i}" }
      campaign.update!(truths: existing)

      apply({ 'truths' => Array.new(5) { |i| "New #{i}" } }, sections: %w[truths])

      expect(campaign.truths.size).to eq(Campaign::MAX_TRUTHS)
      expect(campaign.truths).to eq(existing + ['New 0', 'New 1'])
    end

    it 'caps each truth at 300 characters' do
      apply({ 'truths' => ['t' * 400] }, sections: %w[truths])

      expect(campaign.truths.last.length).to eq(300)
    end

    it 'keeps the truths when the outline has none' do
      apply({}, sections: %w[truths])

      expect(campaign.truths).to eq(['Magic is fading'])
    end
  end

  describe 'factions' do
    it 'creates factions with their goal and description' do
      apply({ 'factions' => [{ 'name' => ' Iron Hand ', 'goal' => 'Seize the throne', 'description' => 'Mercenaries' }] })

      expect(campaign.factions.sole).to have_attributes(name: 'Iron Hand', goal: 'Seize the throne', description: 'Mercenaries')
    end

    it 'names unnamed factions and caps long text' do
      apply({ 'factions' => [{ 'name' => '', 'goal' => 'g' * 1500 }, { 'name' => 'n' * 200 }] })

      unnamed, long = campaign.factions.order(:id).to_a
      expect(unnamed).to have_attributes(name: 'Unnamed faction', description: nil)
      expect(unnamed.goal.length).to eq(1000)
      expect(long.name.length).to eq(120)
    end

    it 'creates at most 8' do
      apply({ 'factions' => Array.new(10) { |i| { 'name' => "Faction #{i}" } } })

      expect(campaign.factions.count).to eq(8)
    end
  end

  describe 'npcs' do
    it 'links an NPC to a faction already in the campaign' do
      faction = create(:campaign_faction, campaign: campaign, name: 'Iron Hand')

      apply({ 'npcs' => [{ 'name' => 'Vex', 'faction' => 'iron hand' }] }, sections: %w[npcs])

      expect(campaign.npcs.sole.faction).to eq(faction)
    end

    it 'creates NPCs with their details' do
      apply({ 'npcs' => [{ 'name' => 'Vex', 'role' => 'bbeg', 'description' => 'A pale noble', 'motive' => 'Power',
                           'secret' => 'She is the true heir' }] })

      expect(campaign.npcs.sole).to have_attributes(name: 'Vex', role: 'bbeg', description: 'A pale noble',
                                                    motive: 'Power', secret: 'She is the true heir', faction: nil)
    end

    it 'defaults a missing or unknown role to neutral' do
      apply({ 'npcs' => [{ 'name' => 'Overlord', 'role' => 'overlord' }, { 'name' => 'Nobody' }, { 'name' => 'Ally', 'role' => 'ally' }] })

      expect(campaign.npcs.order(:id).pluck(:role)).to eq(%w[neutral neutral ally])
    end

    it 'names unnamed NPCs' do
      apply({ 'npcs' => [{ 'role' => 'ally' }] })

      expect(campaign.npcs.sole.name).to eq('Unnamed NPC')
    end

    it 'links an NPC to a faction from the outline by name, ignoring case and spacing' do
      apply({ 'factions' => [{ 'name' => 'Iron Hand' }], 'npcs' => [{ 'name' => 'Vex', 'faction' => '  iron HAND ' }] })

      expect(campaign.npcs.sole.faction).to eq(campaign.factions.sole)
    end

    it 'leaves the faction empty when no faction in the outline has that name' do
      apply({ 'factions' => [{ 'name' => 'Iron Hand' }],
              'npcs' => [{ 'name' => 'Vex', 'faction' => 'Silver Hand' }, { 'name' => 'Rook', 'faction' => nil }] })

      expect(campaign.npcs.pluck(:faction_id)).to eq([nil, nil])
    end

    it 'does not create factions that were not approved' do
      apply({ 'factions' => [{ 'name' => 'Iron Hand' }], 'npcs' => [{ 'name' => 'Vex', 'faction' => 'Iron Hand' }] },
            sections: %w[npcs])

      expect(campaign.factions).to be_empty
      expect(campaign.npcs.sole.faction).to be_nil
    end

    it 'creates at most 20' do
      apply({ 'npcs' => Array.new(25) { |i| { 'name' => "NPC #{i}" } } })

      expect(campaign.npcs.count).to eq(20)
    end
  end

  describe 'fronts' do
    it 'creates a front led by an NPC from the outline' do
      apply({
              'npcs' => [{ 'name' => 'Vex' }],
              'fronts' => [{ 'name' => 'The Usurper', 'goal' => 'Take the throne', 'doom' => 'Tyranny', 'leader' => 'VEX',
                             'portents' => ['Crows gather', '', 'Bells toll'], 'clock_segments' => 6 }]
            })

      expect(campaign.fronts.sole).to have_attributes(
        name: 'The Usurper', goal: 'Take the throne', doom: 'Tyranny', npc: campaign.npcs.sole, clock_segments: 6,
        clock_filled: 0, portents: [{ 'text' => 'Crows gather', 'triggered' => false }, { 'text' => 'Bells toll', 'triggered' => false }]
      )
    end

    it 'leaves the leader empty when no NPC in the outline has that name' do
      apply({ 'npcs' => [{ 'name' => 'Vex' }], 'fronts' => [{ 'name' => 'The Usurper', 'leader' => 'Rook' }] })

      expect(campaign.fronts.sole.npc).to be_nil
    end

    it 'links a leader already in the campaign' do
      existing = create(:campaign_npc, campaign: campaign, name: 'Rook')

      apply({ 'fronts' => [{ 'name' => 'The Usurper', 'leader' => 'rook' }] })

      expect(campaign.fronts.sole.npc).to eq(existing)
    end

    it 'keeps clocks within the allowed segments' do
      apply({ 'fronts' => [{ 'name' => 'Low', 'clock_segments' => 1 }, { 'name' => 'High', 'clock_segments' => 40 },
                           { 'name' => 'Text', 'clock_segments' => '8' }, { 'name' => 'Missing' }] })

      expect(campaign.fronts.order(:id).pluck(:name, :clock_segments)).to eq(
        [['Low', CampaignFront::CLOCK_SEGMENTS.min], ['High', CampaignFront::CLOCK_SEGMENTS.max], ['Text', 8],
         ['Missing', described_class::DEFAULT_CLOCK_SEGMENTS]]
      )
    end

    it 'caps portents at CampaignFront::MAX_PORTENTS' do
      apply({ 'fronts' => [{ 'name' => 'The Usurper', 'portents' => Array.new(15) { |i| "Sign #{i}" } }] })

      expect(campaign.fronts.sole.portents.size).to eq(CampaignFront::MAX_PORTENTS)
    end

    it 'names unnamed fronts' do
      apply({ 'fronts' => [{ 'goal' => 'Chaos' }] })

      expect(campaign.fronts.sole.name).to eq('Unnamed threat')
    end

    it 'creates at most 5' do
      apply({ 'fronts' => Array.new(7) { |i| { 'name' => "Front #{i}" } } })

      expect(campaign.fronts.count).to eq(5)
    end
  end

  describe 'locations' do
    it 'creates locations with their features' do
      apply({ 'locations' => [{ 'name' => 'Frostgate', 'description' => 'A walled town',
                                'features' => ['Frozen moat', ' ', 'Bell tower', 'f' * 400] }] })

      location = campaign.locations.sole
      expect(location).to have_attributes(name: 'Frostgate', description: 'A walled town')
      expect(location.features).to eq(['Frozen moat', 'Bell tower', 'f' * 300])
    end

    it 'caps features at CampaignLocation::MAX_FEATURES' do
      apply({ 'locations' => [{ 'name' => 'Frostgate', 'features' => Array.new(25) { |i| "Feature #{i}" } }] })

      expect(campaign.locations.sole.features.size).to eq(CampaignLocation::MAX_FEATURES)
    end

    it 'names unnamed locations' do
      apply({ 'locations' => [{ 'description' => 'Somewhere' }] })

      expect(campaign.locations.sole.name).to eq('Unnamed place')
    end

    it 'creates at most 15' do
      apply({ 'locations' => Array.new(18) { |i| { 'name' => "Place #{i}" } } })

      expect(campaign.locations.count).to eq(15)
    end
  end

  describe 'quests' do
    it 'creates main and side quests in outline order with their giver' do
      apply({
              'npcs' => [{ 'name' => 'Vex' }],
              'quests' => [
                { 'name' => 'Recover the crown', 'kind' => 'main', 'act' => 2, 'description' => 'Find it',
                  'reward' => 'A title', 'giver' => 'vex' },
                { 'name' => 'Lost cat', 'kind' => 'side', 'act' => 1, 'giver' => 'Nobody' }
              ]
            })

      main, side = campaign.quests.order(:position).to_a
      expect(main).to have_attributes(name: 'Recover the crown', kind: 'main', act: 2, description: 'Find it',
                                      reward: 'A title', giver_npc: campaign.npcs.sole, position: 0, status: 'available')
      expect(side).to have_attributes(name: 'Lost cat', kind: 'side', act: nil, giver_npc: nil, position: 1)
    end

    it 'defaults a missing or unknown kind to side' do
      apply({ 'quests' => [{ 'name' => 'Epic', 'kind' => 'epic', 'act' => 1 }, { 'name' => 'Plain' }] })

      expect(campaign.quests.order(:position).pluck(:kind, :act)).to eq([['side', nil], ['side', nil]])
    end

    it 'keeps acts between 1 and 20 for main quests' do
      apply({ 'quests' => [0, 25, '3', nil, 20].map { |act| { 'name' => "Act #{act.inspect}", 'kind' => 'main', 'act' => act } } })

      expect(campaign.quests.order(:position).pluck(:act)).to eq([nil, nil, 3, nil, 20])
    end

    it 'names unnamed quests' do
      apply({ 'quests' => [{ 'kind' => 'main' }] })

      expect(campaign.quests.sole.name).to eq('Unnamed quest')
    end

    it 'creates at most 20' do
      apply({ 'quests' => Array.new(22) { |i| { 'name' => "Quest #{i}" } } })

      expect(campaign.quests.count).to eq(20)
    end
  end

  describe 'secrets' do
    it 'creates unrevealed secrets with their revelation' do
      apply({ 'secrets' => [{ 'revelation' => 'The king lives', 'text' => 'A servant saw him' }] })

      expect(campaign.secrets.sole).to have_attributes(revelation: 'The king lives', text: 'A servant saw him',
                                                       position: 0, revealed?: false)
    end

    it 'skips secrets without text' do
      apply({ 'secrets' => [{ 'revelation' => 'No clue' }, { 'text' => '   ' }, { 'text' => 'A real clue' }] })

      expect(campaign.secrets.sole).to have_attributes(text: 'A real clue', revelation: nil, position: 2)
    end

    it 'caps revelations at 120 characters and text at 1000' do
      apply({ 'secrets' => [{ 'revelation' => 'r' * 200, 'text' => 't' * 1200 }] })

      secret = campaign.secrets.sole
      expect(secret.revelation.length).to eq(120)
      expect(secret.text.length).to eq(1000)
    end

    it 'creates at most 30' do
      apply({ 'secrets' => Array.new(35) { |i| { 'text' => "Clue #{i}" } } })

      expect(campaign.secrets.count).to eq(30)
    end
  end

  describe 'sessions' do
    it 'skips session numbers outside 1 to 100' do
      apply({ 'sessions' => [{ 'number' => 99_999_999_999, 'title' => 'Huge' }, { 'number' => 0 }, { 'number' => 101 }] })

      expect(campaign.sessions).to be_empty
    end

    it 'creates the proposed sessions at the starting level' do
      apply({ 'sessions' => [
              { 'number' => 1, 'title' => 'The Heist', 'strong_start' => 'Alarm bells', 'scenes' => ['Vault', '', 'Rooftops'] },
              { 'number' => '2', 'title' => 'The Chase' }
            ] })

      first, second = campaign.sessions.order(:number).to_a
      expect(first).to have_attributes(number: 1, title: 'The Heist', strong_start: 'Alarm bells',
                                       scenes: %w[Vault Rooftops], level: 3, status: 'planned')
      expect(second).to have_attributes(number: 2, title: 'The Chase', strong_start: nil, scenes: [], level: 3)
    end

    it 'does not overwrite what the DM already wrote' do
      existing = create(:campaign_session, campaign: campaign, number: 1, title: 'My Title', scenes: ['My scene'],
                                           level: 5, log: 'We played')

      apply({ 'sessions' => [{ 'number' => 1, 'title' => 'AI Title', 'strong_start' => 'AI start',
                               'scenes' => ['AI scene'] }] })

      expect(existing.reload).to have_attributes(title: 'My Title', strong_start: 'AI start', scenes: ['My scene'],
                                                 level: 5, log: 'We played')
      expect(campaign.sessions.count).to eq(1)
    end

    it 'fills in blank fields of an existing session' do
      existing = create(:campaign_session, campaign: campaign, number: 2)

      apply({ 'sessions' => [{ 'number' => 2, 'title' => 'AI Title', 'scenes' => ['AI scene'] }] })

      expect(existing.reload).to have_attributes(title: 'AI Title', scenes: ['AI scene'], level: 3)
    end

    it 'skips sessions without a positive number' do
      apply({ 'sessions' => [{ 'number' => 0 }, { 'number' => -1 }, { 'title' => 'No number' }, { 'number' => 'two' }] })

      expect(campaign.sessions).to be_empty
    end

    it 'caps scenes at CampaignSession::MAX_SCENES' do
      apply({ 'sessions' => [{ 'number' => 1, 'scenes' => Array.new(25) { |i| "Scene #{i}" } }] })

      expect(campaign.sessions.sole.scenes.size).to eq(CampaignSession::MAX_SCENES)
    end

    it 'creates at most 12' do
      apply({ 'sessions' => Array.new(15) { |i| { 'number' => i + 1 } } })

      expect(campaign.sessions.count).to eq(12)
    end
  end

  context 'when a record cannot be saved' do
    it 'saves nothing and raises' do
      broken = create(:campaign_session, campaign: campaign, number: 1)
      broken.update_column(:status, 'cancelled')

      expect { apply(full_outline) }.to raise_error(ActiveRecord::RecordInvalid, /Status is not included in the list/)

      expect(campaign.reload.pitch).to be_nil
      expect(campaign.truths).to eq(['Magic is fading'])
      expect(record_counts).to eq([0, 0, 0, 0, 0, 0, 1])
      expect(broken.reload.title).to be_nil
    end
  end
end
