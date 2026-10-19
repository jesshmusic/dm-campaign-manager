require 'rails_helper'

RSpec.describe 'Admin::V1::SetupGuidesController', type: :request do
  before { seed_setup_guide }

  # Not memoized: some examples make more than one request
  def json
    response.parsed_body
  end

  let(:changes) do
    {
      steps: [{ id: 'pitch', label: 'Pitch', title: 'Your pitch', intro: 'Name it.', why: '', example: 'Zombies.' }],
      templates: [{ value: 'sandbox', title: 'Open world', description: 'Go anywhere.', example: 'The Wild Coast.' }]
    }
  end

  describe 'GET /v1/setup_guide' do
    it 'is public, with the steps and templates in order' do
      stub_no_auth

      get '/v1/setup_guide'

      expect(response).to have_http_status(:ok)
      expect(json.keys).to eq(%w[steps templates updatedAt])
      expect(json['steps'].pluck('id')).to eq(%w[kind pitch table world books review])
      expect(json['templates'].pluck('value')).to eq(%w[three_act sandbox five_room blank])
    end

    it 'gives each step and template its words' do
      step = SetupGuideStep.find_by(key: 'world')
      step.update!(example: "One\nTwo", why: nil)
      template = SetupGuideTemplate.find_by(key: 'five_room')

      get '/v1/setup_guide'

      expect(json['steps'][3]).to eq(
        'id' => 'world', 'label' => step.label, 'title' => step.title, 'intro' => step.intro,
        'why' => nil, 'example' => "One\nTwo"
      )
      expect(json['templates'][2]).to eq(
        'value' => 'five_room', 'title' => template.title, 'description' => template.description,
        'example' => template.example
      )
    end

    it 'follows position' do
      SetupGuideStep.find_by(key: 'kind').update!(position: 10)

      get '/v1/setup_guide'

      expect(json['steps'].pluck('id').last).to eq('kind')
    end

    it 'says when the words last changed' do
      travel_to(Time.zone.local(2030, 1, 2, 3, 4, 5)) { SetupGuideStep.find_by(key: 'books').touch }

      get '/v1/setup_guide'

      expect(Time.zone.parse(json['updatedAt'])).to eq(Time.zone.local(2030, 1, 2, 3, 4, 5))
    end

    it 'can be cached for a few minutes' do
      get '/v1/setup_guide'

      expect(response.headers['Cache-Control']).to include('max-age=300', 'public')
    end

    it 'can be read from a Foundry world' do
      get '/v1/setup_guide', headers: { 'Origin' => 'http://localhost:30000' }

      expect(response.headers['Access-Control-Allow-Origin']).to eq('*')
    end
  end

  describe 'PATCH /v1/setup_guide' do
    context 'when signed in as an admin' do
      before { stub_admin_auth }

      it 'changes the words and returns the guide' do
        patch '/v1/setup_guide', params: changes, as: :json

        expect(response).to have_http_status(:ok)
        pitch = SetupGuideStep.find_by(key: 'pitch')
        expect([pitch.title, pitch.intro, pitch.why, pitch.example]).to eq(['Your pitch', 'Name it.', nil, 'Zombies.'])
        expect(SetupGuideTemplate.find_by(key: 'sandbox').title).to eq('Open world')
        expect(json['steps'][1]).to include('id' => 'pitch', 'title' => 'Your pitch', 'why' => nil)
        expect(json['templates'][1]).to include('value' => 'sandbox', 'title' => 'Open world')
        expect(json['steps'].length).to eq(6)
      end

      it 'changes only the steps sent' do
        patch '/v1/setup_guide', params: { steps: [{ id: 'kind', label: 'Type' }] }, as: :json

        expect(response).to have_http_status(:ok)
        expect(SetupGuideStep.find_by(key: 'kind').label).to eq('Type')
        expect(SetupGuideTemplate.find_by(key: 'sandbox').title).not_to eq('Open world')
      end

      it 'never changes which steps there are or their order' do
        patch '/v1/setup_guide',
              params: { steps: [{ id: 'kind', key: 'epilogue', position: 9, label: 'Type' }] }, as: :json

        expect(response).to have_http_status(:ok)
        expect(SetupGuideStep.ordered.pluck(:key)).to eq(SetupGuideStep::KEYS)
      end

      it 'saves nothing when a change is invalid' do
        bad = changes.deep_dup
        bad[:templates] << { value: 'blank', title: '' }

        patch '/v1/setup_guide', params: bad, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to eq(["Blank template: Title can't be blank"])
        expect(SetupGuideStep.find_by(key: 'pitch').title).not_to eq('Your pitch')
        expect(SetupGuideTemplate.find_by(key: 'sandbox').title).not_to eq('Open world')
      end

      it 'rejects a step it does not know' do
        patch '/v1/setup_guide', params: { steps: [{ id: 'epilogue', title: 'The end' }] }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to eq(['Unknown step: epilogue'])
      end

      it 'rejects a template it does not know' do
        patch '/v1/setup_guide', params: { templates: [{ value: 'hexcrawl', title: 'Hexes' }] }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        expect(json['errors']).to eq(['Unknown template: hexcrawl'])
      end
    end

    context 'when signed in as a dungeon master' do
      before { stub_dungeon_master_auth }

      it 'is forbidden' do
        patch '/v1/setup_guide', params: changes, as: :json

        expect(response).to have_http_status(:forbidden)
        expect(SetupGuideStep.find_by(key: 'pitch').title).not_to eq('Your pitch')
      end
    end

    context 'when signed out' do
      before { stub_no_auth }

      it 'is not authenticated' do
        patch '/v1/setup_guide', params: changes, as: :json

        expect(response).to have_http_status(:unauthorized)
        expect(SetupGuideTemplate.find_by(key: 'sandbox').title).not_to eq('Open world')
      end
    end
  end
end
