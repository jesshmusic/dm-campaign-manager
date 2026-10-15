require 'rails_helper'

RSpec.describe CampaignAssistant do
  let(:user) { create(:dungeon_master_user) }
  let(:campaign) do
    create(:campaign, user: user, name: 'Shattered Crown', premise: 'A stolen crown splits the kingdom',
                      setting_name: 'Eldmark', setting_notes: 'Cold northern marches', tone: 'grim', mode: 'arc',
                      planned_sessions: 8, cadence: 'weekly', party_size: 4, start_level: 3, target_level: 10,
                      truths: ['Magic is fading', 'The king is dead'])
  end
  let(:reply) { {}.to_json }
  let(:calls) { [] }
  let(:client) do
    instance_double(OpenAIClient).tap do |double|
      allow(double).to receive(:completions) do |**args|
        calls << args
        reply
      end
    end
  end
  let(:assistant) { described_class.new(campaign, client: client) }

  def prompt
    calls.sole[:prompt]
  end

  describe '.new' do
    it "uses the campaign owner's OpenAI key by default" do
      user.update!(openai_api_key: "sk-#{'a' * 30}")
      allow(OpenAIClient).to receive(:for).and_call_original

      described_class.new(campaign)

      expect(OpenAIClient).to have_received(:for).with(user)
    end

    it 'raises NoKeyError when the owner has no key and no premium' do
      expect { described_class.new(campaign) }.to raise_error(OpenAIClient::NoKeyError)
    end
  end

  describe '#outline' do
    let(:reply) { { 'pitch' => 'Find the crown', 'npcs' => [{ 'name' => 'Vex', 'role' => 'bbeg' }] }.to_json }

    it 'asks for JSON with the planner system prompt and returns the parsed plan' do
      expect(assistant.outline).to eq('pitch' => 'Find the crown', 'npcs' => [{ 'name' => 'Vex', 'role' => 'bbeg' }])
      expect(calls.sole).to include(system: described_class::SYSTEM_PROMPT, json_schema: CampaignAssistantSchemas::OUTLINE,
                                    model: described_class::MODEL, max_tokens: 4000)
    end

    context 'with clues grouped by revelation' do
      let(:reply) do
        { 'revelations' => [{ 'revelation' => 'Vex lies', 'clues' => ['A forged letter', 'A false alibi', 'Ink stains'] }] }.to_json
      end

      it 'returns one secret per clue, each pointing at its revelation' do
        expect(assistant.outline).to eq('secrets' => [
                                           { 'revelation' => 'Vex lies', 'text' => 'A forged letter' },
                                           { 'revelation' => 'Vex lies', 'text' => 'A false alibi' },
                                           { 'revelation' => 'Vex lies', 'text' => 'Ink stains' }
                                         ])
      end
    end

    it 'asks for three clues per revelation' do
      assistant.outline

      expect(prompt).to include('exactly 3', 'the Three Clue Rule')
    end

    it 'describes the campaign' do
      assistant.outline

      expect(prompt).to include(
        'Campaign: Shattered Crown', 'Premise: A stolen crown splits the kingdom', 'Setting: Eldmark',
        'Setting notes: Cold northern marches', 'Tone: grim', 'Structure: arc, 8 sessions, played weekly',
        'Players: 4', 'Levels: 3 to 10', 'Truths: Magic is fading; The king is dead'
      )
    end

    it 'leaves out details the campaign does not have' do
      bare = create(:campaign, user: user, name: 'Bare Bones', mode: 'sandbox')

      described_class.new(bare, client: client).outline

      expect(prompt).to include('Campaign: Bare Bones', 'Structure: sandbox')
      expect(prompt).not_to include('Premise:', 'Setting:', 'Tone:', 'Players:', 'Levels:', 'Truths:',
                                    'Already in the campaign')
    end

    it 'shows a single level when the campaign starts and ends at the same level' do
      campaign.update!(start_level: 5, target_level: 5)

      assistant.outline

      expect(prompt).to match(/^Levels: 5$/)
    end

    it 'keeps the target level when only the target is set' do
      campaign.update!(start_level: nil, target_level: 8)

      assistant.outline

      expect(prompt).to match(/^Levels: up to 8$/)
    end

    it 'lists what is already in the campaign so the AI does not repeat it' do
      create(:campaign_npc, campaign: campaign, name: 'Vex')
      create(:campaign_faction, campaign: campaign, name: 'Iron Hand')
      create(:campaign_front, campaign: campaign, name: 'The Usurper')
      create(:campaign_location, campaign: campaign, name: 'Frostgate')
      create(:campaign_quest, campaign: campaign, name: 'Recover the crown')
      create_list(:campaign_secret, 2, campaign: campaign, revelation: 'The king lives')
      create(:campaign_secret, campaign: campaign, revelation: nil)
      create(:campaign_npc, campaign: create(:campaign, user: user), name: 'Someone Elsewhere')

      assistant.outline

      expect(prompt).to include(
        'Already in the campaign: NPCs: Vex. Factions: Iron Hand. Fronts: The Usurper. Locations: Frostgate. ' \
        'Quests: Recover the crown. Revelations: The king lives'
      )
      expect(prompt).not_to include('Someone Elsewhere')
    end

    it 'lists at most 15 names of each kind' do
      create_list(:campaign_location, 16, campaign: campaign)

      assistant.outline

      expect(prompt[/Locations: ([^.\n]*)/, 1].split(', ').size).to eq(15)
    end

    it 'asks for the planned number of sessions in an arc' do
      assistant.outline

      expect(prompt).to include('"sessions": 8 sessions of')
    end

    it 'asks for six sessions when an arc has no planned count' do
      campaign.update!(planned_sessions: nil)

      assistant.outline

      expect(prompt).to include('"sessions": 6 sessions of')
    end

    it 'asks for at most twelve sessions' do
      campaign.update!(planned_sessions: 40)

      assistant.outline

      expect(prompt).to include('"sessions": 12 sessions of')
    end

    it 'asks for no sessions outside an arc' do
      campaign.update!(mode: 'sandbox')

      assistant.outline

      expect(prompt).to include('"sessions": an empty list')
    end

    context 'when the reply is not JSON' do
      let(:reply) { 'Sure! Here is your campaign plan.' }

      it 'raises an Error' do
        expect { assistant.outline }.to raise_error(described_class::Error,
                                                    'The AI returned something unreadable. Please try again.')
      end
    end

    context 'when the reply has mangled keys' do
      let(:reply) { { '_quests_' => [{ '_name_' => 'Find the crown' }], '$sessions ' => [{ ' Strong_Start ' => 'Ambush' }] }.to_json }

      it 'cleans them up' do
        expect(assistant.outline).to eq('quests' => [{ 'name' => 'Find the crown' }],
                                        'sessions' => [{ 'strong_start' => 'Ambush' }])
      end
    end

    context 'when the reply is JSON but not an object' do
      let(:reply) { [1, 2].to_json }

      it 'raises an Error' do
        expect { assistant.outline }.to raise_error(described_class::Error, /unreadable/)
      end
    end

    context 'when the reply is empty' do
      let(:reply) { nil }

      it 'raises an Error' do
        expect { assistant.outline }.to raise_error(described_class::Error)
      end
    end

    it 'lets OpenAI errors through' do
      allow(client).to receive(:completions).and_raise(OpenAIClient::Error, 'Rate limit reached')

      expect { assistant.outline }.to raise_error(OpenAIClient::Error, 'Rate limit reached')
    end
  end

  describe '#prep' do
    let(:session) do
      create(:campaign_session, campaign: campaign, number: 3, title: 'The Frozen Pass', level: 4,
                                strong_start: 'Wolves attack the caravan', scenes: ['Avalanche', 'Ice bridge'])
    end
    let(:reply) { { 'text' => 'Bandits drop from the cliffs' }.to_json }

    it 'asks for JSON with the planner system prompt and returns the parsed suggestion' do
      expect(assistant.prep(session, 'strong_start')).to eq('text' => 'Bandits drop from the cliffs')
      expect(calls.sole).to include(system: described_class::SYSTEM_PROMPT,
                                    json_schema: CampaignAssistantSchemas::PREP['strong_start'],
                                    model: described_class::MODEL, max_tokens: 1500)
    end

    it 'asks for the shape of each step' do
      {
        'strong_start' => '"text": one strong start',
        'scenes' => '"items": 3-5 short possible scenes',
        'secrets' => '"items": 5 of {"revelation", "text"}',
        'locations' => '"items": 3 of {"name", "description", "features"'
      }.each do |step, shape|
        assistant.prep(session, step)

        expect(calls.last[:prompt]).to include(shape)
      end
      expect(calls.size).to eq(described_class::PREP_STEPS.size)
    end

    it 'describes the campaign and the session' do
      npc = create(:campaign_npc, campaign: campaign, name: 'Vex')
      secret = create(:campaign_secret, campaign: campaign, text: 'The pass is cursed')
      create(:campaign_session_link, session: session, linkable: npc)
      create(:campaign_session_link, session: session, linkable: secret)

      assistant.prep(session, 'scenes')

      expect(prompt).to include(
        'Campaign: Shattered Crown', 'Session 3: The Frozen Pass', 'Party level: 4',
        'Strong start: Wolves attack the caravan', 'Planned scenes: Avalanche; Ice bridge',
        'Prepped: Vex; The pass is cursed'
      )
    end

    it 'includes the latest recap from an earlier session' do
      create(:campaign_session, campaign: campaign, number: 1, recap: 'The party left Frostgate')
      create(:campaign_session, campaign: campaign, number: 2, recap: '')
      create(:campaign_session, campaign: campaign, number: 4, recap: 'Something from the future')

      assistant.prep(session, 'scenes')

      expect(prompt).to include('Last time: The party left Frostgate')
      expect(prompt).not_to include('Something from the future')
    end

    it 'leaves out session details that are blank' do
      bare = create(:campaign_session, campaign: campaign)

      assistant.prep(bare, 'scenes')

      expect(prompt).to match(/^Session 1$/)
      expect(prompt).not_to include('Party level:', 'Strong start:', 'Planned scenes:', 'Prepped:', 'Last time:')
    end

    it 'rejects an unknown step without calling OpenAI' do
      expect { assistant.prep(session, 'treasure') }.to raise_error(described_class::Error, 'Unknown prep step: treasure')
      expect(client).not_to have_received(:completions)
    end
  end

  describe '#recap' do
    let(:session) { create(:campaign_session, campaign: campaign, number: 1, log: 'The party unmasked Vex at the inn.') }
    let(:other_campaign) { create(:campaign, user: user) }
    let!(:secret) { create(:campaign_secret, campaign: campaign, text: 'Vex serves the usurper') }
    let!(:revealed_secret) { create(:campaign_secret, campaign: campaign, text: 'An old rumor', revealed: true) }
    let!(:front) { create(:campaign_front, campaign: campaign, name: 'The Usurper', clock_segments: 6, clock_filled: 2) }
    let!(:quest) { create(:campaign_quest, campaign: campaign, name: 'Recover the crown', status: 'active') }
    let!(:available_quest) { create(:campaign_quest, campaign: campaign, name: 'Clear the mine') }
    let!(:completed_quest) { create(:campaign_quest, campaign: campaign, name: 'Escape the dungeon', status: 'completed') }

    context 'with odd values from the AI' do
      let(:reply) do
        { recap: 'They met Vex.', revealed_secret_ids: [true, 'abc', secret.id.to_s, nil],
          clock_advances: [{ front_id: front.id, segments: 'lots' }, 'nonsense'],
          quest_updates: [{ quest_id: [quest.id], status: 'completed' }] }.to_json
      end

      it 'keeps only well-formed ids and values' do
        expect(assistant.recap(session)).to eq(
          'recap' => 'They met Vex.', 'revealed_secret_ids' => [secret.id],
          'clock_advances' => [{ 'front_id' => front.id, 'segments' => 1 }], 'quest_updates' => []
        )
      end
    end

    it 'sends the log with the unrevealed secrets, fronts and open quests' do
      assistant.recap(session)

      expect(calls.sole).to include(system: described_class::SYSTEM_PROMPT, json_schema: CampaignAssistantSchemas::RECAP,
                                    model: described_class::MODEL, max_tokens: 1200)
      expect(prompt).to include(
        'Campaign: Shattered Crown', "Session 1 log:\nThe party unmasked Vex at the inn.",
        "#{secret.id}: Vex serves the usurper", "#{front.id}: The Usurper, 2/6",
        "#{quest.id}: Recover the crown, active", "#{available_quest.id}: Clear the mine, available"
      )
      expect(prompt).not_to include('An old rumor', "#{completed_quest.id}: Escape the dungeon")
    end

    it "says 'none' when nothing is open" do
      bare_session = create(:campaign_session, campaign: other_campaign, log: 'Nothing happened.')

      described_class.new(other_campaign, client: client).recap(bare_session)

      expect(prompt).to include("Unrevealed secrets (id: text):\nnone", "Fronts (id: name, clock filled/segments):\nnone",
                                "Open quests (id: name, status):\nnone")
    end

    context 'when the AI suggests changes' do
      let(:foreign_secret) { create(:campaign_secret, campaign: other_campaign) }
      let(:foreign_front) { create(:campaign_front, campaign: other_campaign) }
      let(:foreign_quest) { create(:campaign_quest, campaign: other_campaign, status: 'active') }
      let(:reply) do
        {
          recap: "  The party unmasked Vex.\n",
          revealed_secret_ids: [secret.id.to_s, secret.id, revealed_secret.id, foreign_secret.id, 'abc', nil],
          clock_advances: [
            { front_id: front.id.to_s, segments: '2' },
            { front_id: foreign_front.id, segments: 1 },
            'advance the usurper',
            { front_id: front.id, segments: 0 },
            { front_id: front.id, segments: 99 },
            { segments: 1 }
          ],
          quest_updates: [
            { quest_id: quest.id.to_s, status: 'completed' },
            { quest_id: available_quest.id, status: 'active' },
            { quest_id: quest.id, status: 'available' },
            { quest_id: quest.id, status: 'abandoned' },
            { quest_id: foreign_quest.id, status: 'failed' },
            { quest_id: completed_quest.id, status: 'failed' },
            ['not', 'an', 'update']
          ]
        }.to_json
      end

      it "keeps only well-formed changes to this campaign's open records" do
        expect(assistant.recap(session)).to eq(
          'recap' => 'The party unmasked Vex.',
          'revealed_secret_ids' => [secret.id],
          'clock_advances' => [
            { 'front_id' => front.id, 'segments' => 2 },
            { 'front_id' => front.id, 'segments' => 1 },
            { 'front_id' => front.id, 'segments' => 12 }
          ],
          'quest_updates' => [
            { 'quest_id' => quest.id, 'status' => 'completed' },
            { 'quest_id' => available_quest.id, 'status' => 'active' }
          ]
        )
      end

      it 'saves nothing' do
        assistant.recap(session)

        expect(secret.reload).not_to be_revealed
        expect(front.reload.clock_filled).to eq(2)
        expect(quest.reload.status).to eq('active')
        expect(session.reload.recap).to be_nil
      end
    end

    context 'when the AI leaves keys out' do
      let(:reply) { { recap: 'Quiet night.' }.to_json }

      it 'returns empty lists' do
        expect(assistant.recap(session)).to eq(
          'recap' => 'Quiet night.', 'revealed_secret_ids' => [], 'clock_advances' => [], 'quest_updates' => []
        )
      end
    end

    it 'requires a session log without calling OpenAI' do
      [nil, '', "  \n"].each do |log|
        session.update!(log: log)

        expect { assistant.recap(session) }.to raise_error(described_class::Error, 'Write a session log first.')
      end
      expect(client).not_to have_received(:completions)
    end

    context 'when the reply is not JSON' do
      let(:reply) { '{"recap": "cut off' }

      it 'raises an Error' do
        expect { assistant.recap(session) }.to raise_error(described_class::Error)
      end
    end
  end
end
