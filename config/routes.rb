Rails.application.routes.draw do
  root to: 'home#index'

  resources :users, except: %i[create new destroy], param: :slug
  patch '/users/:widgetId/change_role', to: 'users#change_role', as: 'user_change_role'
  post '/users/login', to: 'users#set_auth_user', as: 'user_set_user'
  delete '/users/logout', to: 'users#logout_user', as: 'user_logout_user'
  get 'app(/*all)', to: 'home#index'
  scope module: 'admin' do
    namespace :v1 do
      get 'dashboard', to: 'dashboard#index'
      get 'search',
          to: 'search#index',
          constraints: { format: 'json' }
      get '/adventure_hook', to: 'dashboard#adventure_hook',
                             as: 'adventure_hook',
                             constraints: { format: 'json' }
      get '/random_fantasy_name', to: 'dashboard#random_fantasy_name',
                                  as: 'random_fantasy_name',
                                  constraints: { format: 'json' }
      get '/random_tavern_name', to: 'dashboard#random_tavern_name',
                                 as: 'random_tavern_name',
                                 constraints: { format: 'json' }
      get '/random_monster_name', to: 'dashboard#random_monster_name',
                                  as: 'random_monster_name',
                                  constraints: { format: 'json' }
      post '/quick_monster', to: 'monsters#quick_monster',
                             as: 'quick_monster',
                             constraints: { format: 'json' }
      post '/generate_commoner', to: 'monsters#generate_commoner',
                                 as: 'generate_commoner',
                                 constraints: { format: 'json' }
      post '/generate_commoner_description', to: 'monsters#generate_commoner_description',
                                             as: 'generate_commoner_description',
                                             constraints: { format: 'json' }
      get '/monster-categories', to: 'monsters#monster_categories',
                                 as: 'monster_categories',
                                 constraints: { format: 'json' }
      get '/actions-by-name', to: 'monsters#actions_by_name',
                              as: 'actions_by_name',
                              constraints: { format: 'json' }
      get '/special-abilities', to: 'monsters#special_abilities',
                                as: 'special_abilities',
                                constraints: { format: 'json' }
      post '/calculate_cr', to: 'monsters#calculate_cr',
                            as: 'calculate_cr',
                            constraints: { format: 'json' }
      post '/info_for_cr', to: 'monsters#info_for_cr',
                           as: 'info_for_cr',
                           constraints: { format: 'json' }
      post '/generate_action_desc', to: 'monsters#generate_action_desc',
                                    as: 'generate_action_desc',
                                    constraints: { format: 'json' }
      post '/generate_npc_actions', to: 'monsters#generate_npc_actions',
                                    as: 'generate_npc_actions',
                                    constraints: { format: 'json' }
      post '/generate_npc_concept', to: 'monsters#generate_npc_concept',
                                    as: 'generate_npc_concept',
                                    constraints: { format: 'json' }
      post '/create_from_concept', to: 'monsters#create_from_concept',
                                   as: 'create_from_concept',
                                   constraints: { format: 'json' }
      get '/prof-skills', to: 'proficiencies#skills',
                          as: 'proficiency_skills',
                          constraints: { format: 'json' }
      get '/saving-throws', to: 'proficiencies#saving_throws',
                            as: 'proficiency_saving_throws',
                            constraints: { format: 'json' }
      # Foundry Map API endpoints
      get '/maps/tags', to: 'foundry_maps#tags', constraints: { format: 'json' }
      get '/maps/list', to: 'foundry_maps#list', constraints: { format: 'json' }
      get '/maps/files/:id', to: 'foundry_maps#files', constraints: { format: 'json' }
      post '/maps/file/:id', to: 'foundry_maps#file', constraints: { format: 'json' }
      post '/maps/:id/upload_files', to: 'foundry_maps#upload_files'
      post '/maps/:id/upload_package', to: 'foundry_maps#upload_package'
      post '/maps/:id/upload_chunk', to: 'foundry_maps#upload_chunk'
      post '/maps/:id/finalize_upload', to: 'foundry_maps#finalize_upload'
      post '/maps/:id/upload_thumbnail', to: 'foundry_maps#upload_thumbnail'
      post '/maps/upload_image', to: 'foundry_maps#upload_image'
      delete '/maps/:id/files/:file_id', to: 'foundry_maps#delete_file'
      resources :foundry_maps, path: 'maps', except: %i[new edit], constraints: { format: 'json' }

      # Foundry Map Tags CRUD
      resources :foundry_map_tags, path: 'map-tags', only: %i[index create update destroy], constraints: { format: 'json' }

      # Patreon OAuth endpoints
      get '/users/:user_id/ready', to: 'patreon_auth#check_status', constraints: { format: 'json' }
      get '/patreon/callback', to: 'patreon_auth#callback'

      # Admin UI for managing maps
      get '/maps-admin', to: 'foundry_maps_admin#index'

      scope except: %i[new edit] do
        resources :actions, only: %i[index create update destroy], constraints: { format: 'json' }
        resources :proficiencies, only: %i[index show], constraints: { format: 'json' }
        resources :skills, only: %i[index show], constraints: { format: 'json' }
        resources :dnd_classes
        resources :items
        # noinspection RailsParamDefResolve
        resources :armor_items, controller: 'items', type: 'ArmorItem'
        # noinspection RailsParamDefResolve
        resources :gear_items, controller: 'items', type: 'GearItem'
        # noinspection RailsParamDefResolve
        resources :magic_items, controller: 'items', type: 'MagicItem'
        # noinspection RailsParamDefResolve
        resources :tool_items, controller: 'items', type: 'ToolItem'
        # noinspection RailsParamDefResolve
        resources :vehicle_items, controller: 'items', type: 'VehicleItem'
        # noinspection RailsParamDefResolve
        resources :weapon_items, controller: 'items', type: 'WeaponItem'
        resources :monsters
        resources :races
        resources :rules
        resources :backgrounds
        resources :feats
        resources :spells
        resources :sections
        resources :widgets, only: %i[index show create update destroy], constraints: { format: 'json' }
      end
    end
  end
end
