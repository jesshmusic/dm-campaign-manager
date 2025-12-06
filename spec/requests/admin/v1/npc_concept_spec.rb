# frozen_string_literal: true

require 'rails_helper'

RSpec.describe 'NPC Concept Endpoints', type: :request do
  let(:dm_user) { create(:dungeon_master_user) }
  let(:admin_user) { create(:admin_user) }

  let(:valid_concept_params) do
    {
      description: 'A fearsome shadow creature that lurks in dark corners',
      challenge_rating: '2',
      monster_type: 'undead',
      alignment: 'chaotic evil'
    }
  end

  let(:mock_concept_response) do
    {
      name: 'Shadow Lurker',
      size: 'medium',
      monster_type: 'undead',
      alignment: 'chaotic evil',
      armor_class: 13,
      armor_description: 'natural armor',
      hit_points: 45,
      hit_dice: '6d8+18',
      challenge_rating: '2',
      xp: 450,
      prof_bonus: 2,
      strength: 14,
      dexterity: 16,
      constitution: 16,
      intelligence: 8,
      wisdom: 12,
      charisma: 10,
      speeds: [{ name: 'walk', value: 30 }],
      senses: [{ name: 'darkvision', value: 120 }],
      saving_throws: %w[Dexterity Wisdom],
      skills: %w[Stealth Perception],
      damage_resistances: ['necrotic'],
      damage_immunities: ['poison'],
      damage_vulnerabilities: ['radiant'],
      condition_immunities: %w[poisoned exhaustion],
      languages: 'understands Common but cannot speak',
      actions: [
        { name: 'Shadow Claw', desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 10 (2d6 + 3) necrotic damage.' }
      ],
      special_abilities: [
        { name: 'Shadow Stealth', desc: 'While in dim light or darkness, the shadow lurker can take the Hide action as a bonus action.' }
      ],
      reactions: [],
      legendary_actions: []
    }
  end

  describe 'POST /v1/generate_npc_concept' do
    before do
      allow(NpcConceptGenerator).to receive(:generate).and_return(mock_concept_response)
    end

    context 'with valid params' do
      it 'returns a concept object' do
        post v1_generate_npc_concept_path(format: :json), params: valid_concept_params

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['concept']).to be_present
        expect(json['concept']['name']).to eq('Shadow Lurker')
      end

      it 'includes ability scores' do
        post v1_generate_npc_concept_path(format: :json), params: valid_concept_params

        json = JSON.parse(response.body)
        expect(json['concept']['strength']).to eq(14)
        expect(json['concept']['dexterity']).to eq(16)
      end

      it 'includes actions and abilities' do
        post v1_generate_npc_concept_path(format: :json), params: valid_concept_params

        json = JSON.parse(response.body)
        expect(json['concept']['actions']).to be_an(Array)
        expect(json['concept']['special_abilities']).to be_an(Array)
      end
    end

    context 'with invalid params' do
      before do
        allow(NpcConceptGenerator).to receive(:generate).and_raise(ArgumentError, 'Description must be at least 10 characters')
      end

      it 'returns unprocessable entity with error' do
        post v1_generate_npc_concept_path(format: :json), params: { description: 'short' }

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['error']).to include('at least 10 characters')
      end
    end

    context 'when generator returns error' do
      before do
        allow(NpcConceptGenerator).to receive(:generate).and_return({ error: 'Failed to generate concept' })
      end

      it 'returns unprocessable entity with error' do
        post v1_generate_npc_concept_path(format: :json), params: valid_concept_params

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['error']).to eq('Failed to generate concept')
      end
    end
  end

  describe 'POST /v1/create_from_concept' do
    let(:concept_params) do
      {
        concept: mock_concept_response.merge(
          speeds: [{ name: 'walk', value: 30 }],
          senses: [{ name: 'darkvision', value: 120 }],
          actions: [{ name: 'Claw', desc: 'Melee attack' }],
          special_abilities: [{ name: 'Shadow Stealth', desc: 'Can hide as bonus action' }],
          reactions: [],
          legendary_actions: []
        )
      }
    end

    context 'without authentication' do
      it 'returns a monster without saving' do
        expect {
          post v1_create_from_concept_path(format: :json), params: concept_params
        }.not_to change(Monster, :count)

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['name']).to eq('Shadow Lurker')
      end
    end

    context 'with dungeon master user' do
      before do
        allow_any_instance_of(AuthorizationService).to receive(:get_current_user).and_return(dm_user)
      end

      it 'saves the monster' do
        expect {
          post v1_create_from_concept_path(format: :json), params: concept_params
        }.to change(Monster, :count).by(1)

        expect(response).to have_http_status(:created)
      end

      it 'assigns user to monster' do
        post v1_create_from_concept_path(format: :json), params: concept_params

        json = JSON.parse(response.body)
        monster = Monster.find_by(name: 'Shadow Lurker')
        expect(monster.user).to eq(dm_user)
      end

      it 'creates nested associations' do
        post v1_create_from_concept_path(format: :json), params: concept_params

        monster = Monster.find_by(name: 'Shadow Lurker')
        expect(monster.speeds.count).to eq(1)
        expect(monster.senses.count).to eq(1)
        expect(monster.monster_actions.count).to eq(1)
        expect(monster.special_abilities.count).to eq(1)
      end
    end

    context 'with admin user' do
      before do
        allow_any_instance_of(AuthorizationService).to receive(:get_current_user).and_return(admin_user)
      end

      it 'saves the monster' do
        expect {
          post v1_create_from_concept_path(format: :json), params: concept_params
        }.to change(Monster, :count).by(1)

        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid concept data' do
      before do
        allow_any_instance_of(AuthorizationService).to receive(:get_current_user).and_return(dm_user)
      end

      it 'returns error for missing name' do
        invalid_concept = concept_params.deep_dup
        invalid_concept[:concept][:name] = ''

        post v1_create_from_concept_path(format: :json), params: invalid_concept

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
