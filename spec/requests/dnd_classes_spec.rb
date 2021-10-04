require 'rails_helper'

RSpec.describe 'DndClasses', type: :request do
  let!(:admin) { create :admin_user }
  let!(:dungeon_master) { create :dungeon_master_user }
  let!(:other_user) { create :other_user }

  ability_score_ids = [
    AbilityScore.find_by_full_name('Wisdom').id,
    AbilityScore.find_by_full_name('Intelligence').id,
  ]

  let(:valid_attributes) {
    {
      api_url: '/v1/dnd_classes/sorcerer-supreme',
      hit_die: 6,
      name: 'Sorcerer Supreme',
      slug: 'sorcerer-supreme',
      spell_ability: 'WIS',
      subclasses: [
        'Wong',
        'Doctor Strange'
      ],
      ability_score_ids: ability_score_ids,
      spell_ids: [],
      prof_ids: [],
      dnd_class_levels_attributes: [
        {
          ability_score_bonuses: 2,
          level: 1,
          prof_bonus: 3,
          class_features_attributes: [
            level: 1,
            name: 'Time Stone',
            desc: [
              'This is a test',
              'Here is line 2.'
            ],
            class_level_choice_attributes: {
              name: 'Spell Powers',
              num_choices: 1,
              choices: [
                'awesome',
                'lame',
                'just ok'
              ]
            },
            expertise_options_attributes: {
              name: 'Spell Expertises',
              num_choices: 1,
              choices: [
                'awesome',
                'lame',
                'just ok'
              ]
            },
            subfeature_options_attributes: {
              name: 'Spell Subfeature Options... what is this?',
              num_choices: 1,
              choices: [
                'awesome',
                'lame',
                'just ok'
              ]
            },
            prerequisites_attributes: [
              { level: 1, name: 'Approval from the main sorcerer' }
            ]
          ],
          class_specifics_attributes: [
            {
              index: 'time-stone-something',
              name: 'Time Stone Something',
              value: 'Eye of Agamoto',
              class_specific_spell_slots_attributes: [
                { sorcery_point_cost: 3, spell_slot_level: 1 }
              ]
            }
          ],
          class_spellcasting_attributes: {
            cantrips_known: 2,
            spell_slots_level_1: 1,
            spell_slots_level_2: 0,
            spell_slots_level_3: 0,
            spell_slots_level_4: 0,
            spell_slots_level_5: 0,
            spell_slots_level_6: 0,
            spell_slots_level_7: 0,
            spell_slots_level_8: 0,
            spell_slots_level_9: 0,
            spells_known: 3
          }
        }
      ],
      equipments_attributes: [
        { name: 'Eye of Agamoto', quantity: 1 },
        { name: 'Cloak of Levitation', quantity: 1 }
      ],
      multi_classing_attributes: {
        multi_class_prereqs_attributes: [
          { ability_score: 'INT', minimum_score: 12 }
        ],
        multi_classing_prereq_option_attributes: {
          choose: 1,
          prereq_type: 'Something',
          multi_class_prereqs_attributes: [
            { ability_score: 'INT', minimum_score: 12 }
          ],
        },
        prof_ids: [],
        prof_choices_attributes: [
          name: 'Test Prof Choice',
          num_choices: 0,
          prof_choice_type: 'Skill',
          prof_ids: []
        ]
      },
      prof_choices_attributes: [
        name: 'Test Prof Choice',
        num_choices: 0,
        prof_choice_type: 'Skill',
        prof_ids: []
      ],
      spell_casting_attributes: {
        level: 1,
        # ability_score_id: ability_score_ids.first,
        spell_casting_infos_attributes: [
          name: 'Info',
          desc: [
            'Sentence 1',
            'Sentence 2'
          ]
        ]
      },
      starting_equipment_options_attributes: [
        {
          choose: 1,
          equipment_category: 'Adventuring Gear',
          equipment_type: 'Gear',
          equipment_ids: [],
          equipment_options_attributes: [
            choose: 1,
            equipment_category: 'Adventuring Gear',
            equipment_type: 'Gear',
            equipment_ids: [],
          ]
        }
      ]
    }
  }

  let(:valid_attributes_dm) {
    attributes_for(:dnd_class, user_id: dungeon_master.id, name: 'Sorcerer Supreme DM')
  }

  let!(:death_knight_class) {
    create :dnd_class,
           name: 'Death Knight',
           user_id: dungeon_master.id
  }
  let!(:death_knight_class_other) {
    create :dnd_class,
           name: 'Death Knight',
           user_id: other_user.id
  }

  describe 'GET /v1/dnd_classes' do
    before() do
      death_knight_class.subclasses = ['Super Death Knight']
      death_knight_class_other.subclasses = ['Super Duper Death Knight']
    end
    context 'for Logged Out Users' do
      it 'should return a success response' do
        get v1_dnd_classes_path
        expect(response).to have_http_status(200)
      end

      it 'should return 12 DndClasses for logged out user' do
        get '/v1/dnd_classes.json'
        result_items = JSON.parse response.body, symbolize_names: true
        expect(result_items[:count]).to eq(12)
        expect(result_items[:results].count).to eq(12)
      end

      it 'should return results based on search query' do
        get '/v1/dnd_classes.json?search=fighter'
        result_monsters = JSON.parse response.body, symbolize_names: true
        expect(result_monsters[:count]).to eq(1)
        expect(result_monsters[:results].first[:name]).to eq('Fighter')
      end
    end

    context 'for Admins' do
      it 'should return 14 DndClasses for signed in admin (Admins can see all classes)' do
        sign_in admin
        get '/v1/dnd_classes.json'
        result_items = JSON.parse response.body, symbolize_names: true
        expect(result_items[:count]).to eq(14)
        expect(result_items[:results].count).to eq(14)
      end
    end

    context 'for Dungeon Masters' do
      it 'should return 13 DndClasses for signed in user who has created a custom class' do
        sign_in dungeon_master
        get '/v1/dnd_classes.json'
        result_items = JSON.parse response.body, symbolize_names: true
        expect(result_items[:count]).to eq(13)
        expect(result_items[:results].count).to eq(13)
      end
    end
  end

  describe 'GET /v1/dnd_classes/:slug' do
    context 'for Logged Out users' do
      it 'should return error for logged out user' do
        get '/v1/dnd_classes/fighter.json'
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:slug]).to eq('fighter')
        expect(result_item[:name]).to eq('Fighter')
      end
    end

    context 'for Admin users' do
      it 'should return a user\'s Death Knight class' do
        sign_in admin
        get "/v1/dnd_classes/#{death_knight_class.slug}.json"
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:slug]).to eq('death-knight-jesshdm1')
        expect(result_item[:name]).to eq('Death Knight')
      end
    end

    context 'for Dungeon Master users' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should return a success response' do
        get '/v1/dnd_classes/fighter.json'
        expect(response).to have_http_status(200)
      end

      it 'should return Death Knight class for logged in DM with proper slug' do
        get "/v1/dnd_classes/#{death_knight_class.slug}.json"
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:slug]).to eq('death-knight-jesshdm1')
        expect(result_item[:name]).to eq('Death Knight')
      end

      it 'should return the other Death Knight class for logged in DM with proper slug' do
        sign_in other_user
        other_username = other_user.username
        get "/v1/dnd_classes/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:slug]).not_to eq('death-knight-jesshdm1')
        expect(result_item[:slug]).to eq("death-knight-#{other_username}")
        expect(result_item[:name]).to eq('Death Knight')
      end
    end
  end

  describe 'POST /v1/dnd_classes' do
    context 'for Logged Out Users' do
      it 'should return an error' do
        expect {
          post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes }
        }.to change(DndClass, :count).by(0)
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      it 'should create a new DndClass' do
        sign_in admin
        post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:userId]).to be_nil
        expect(result_item[:name]).to eq('Sorcerer Supreme')
        expect(result_item[:subclasses].count).to eq(2)
        expect(result_item[:subclasses].first).to eq('Wong')
        expect(result_item[:abilityScores].first[:desc].first).to eq('Wisdom reflects how attuned you are to the world around you and represents perceptiveness and intuition.')
        expect(result_item[:levels].first[:spellcasting][:spellSlotsLevel1]).to eq(1)
        expect(DndClass.count).to eq(15)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should create a new DndClass' do
        expect {
          post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes_dm }
        }.to change(DndClass, :count).by(1)
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:userId]).not_to be_nil
        expect(result_item[:name]).to eq('Sorcerer Supreme DM')
        expect(result_item[:slug]).to eq('sorcerer-supreme-dm-jesshdm1')
      end

      it 'should create a new DndClasses with unique slugs' do
        post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes_dm }

        sign_in other_user
        other_username = other_user.username
        expect {
          post '/v1/dnd_classes.json', params: { dnd_class: valid_attributes }
        }.to change(DndClass, :count).by(1)
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:userId]).not_to be_nil
        expect(result_item[:userId]).to eq(other_user.id)
        expect(result_item[:name]).to eq('Sorcerer Supreme')
        expect(result_item[:slug]).to eq("sorcerer-supreme-#{other_username}")
      end
    end
  end

  describe 'PATCH/PUT /v1/dnd_classes/:slug' do
    context 'for Logged Out Users' do
      it 'should return an error for non-user editing' do
        put '/v1/dnd_classes/fighter.json', params: {
          dnd_class: {
            name: 'Fighter Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should update a default class' do
        put '/v1/dnd_classes/barbarian.json', params: {
          dnd_class: {
            name: 'Barbarian Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:userId]).to be_nil
        expect(result_item[:name]).to eq('Barbarian Edited')
        expect(result_item[:slug]).to eq('barbarian-edited')
      end

      it 'should update a DM\'s class (rare) and persists the DM\'s ownership of the class' do
        put "/v1/dnd_classes/#{death_knight_class.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:name]).to eq('Death Knight Edited')
        expect(result_item[:slug]).to eq('death-knight-edited-jesshdm1')
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should update the requested item belonging to DM' do
        put "/v1/dnd_classes/#{death_knight_class.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:name]).to eq('Death Knight Edited')
        expect(result_item[:slug]).to eq('death-knight-edited-jesshdm1')
      end

      it 'should return an error for attempting to edit another user\'s DndClass' do
        put "/v1/dnd_classes/#{death_knight_class_other.slug}.json", params: {
          dnd_class: {
            name: 'Death Knight Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:errors]).to eq('UserProps action not allowed.')
      end

      it 'should return an error for non-admin editing' do
        put '/v1/dnd_classes/fighter.json', params: {
          dnd_class: {
            name: 'Fighter Edited',
          }
        }
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:errors]).to eq('UserProps action not allowed.')
      end
    end
  end

  describe 'DELETE /v1/dnd_classes/:slug' do
    context 'for Logged Out Users' do
      it 'should return an error for non-user editing' do
        delete '/v1/dnd_classes/fighter.json'
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:error]).to eq('You need to sign in or sign up before continuing.')
      end
    end

    context 'for Admins' do
      before(:each) do
        sign_in admin
      end

      it 'should delete a default class' do
        delete '/v1/dnd_classes/fighter.json'
        expect(response).to have_http_status(204)
      end

      it 'should update a DM\'s class (rare) and persists the DM\'s ownership of the class' do
        delete "/v1/dnd_classes/#{death_knight_class.slug}.json"
        expect(response).to have_http_status(204)
      end
    end

    context 'for Dungeon Masters' do
      before(:each) do
        sign_in dungeon_master
      end

      it 'should delete the requested item belonging to DM' do
        delete "/v1/dnd_classes/#{death_knight_class.slug}.json"
        expect(response).to have_http_status(204)
      end

      it 'should return an error for attempting to delete another user\'s DndClass' do
        delete "/v1/dnd_classes/#{death_knight_class_other.slug}.json"
        result_item = JSON.parse response.body, symbolize_names: true
        expect(result_item[:errors]).to eq('UserProps action not allowed.')
      end
    end
  end
end
