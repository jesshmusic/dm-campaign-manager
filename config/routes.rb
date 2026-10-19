Rails.application.routes.draw do
  root to: 'home#index'

  resources :users, except: %i[create new destroy], param: :slug
  patch '/users/:widgetId/change_role', to: 'users#change_role', as: 'user_change_role'
  post '/users/login', to: 'users#set_auth_user', as: 'user_set_user'
  delete '/users/logout', to: 'users#logout_user', as: 'user_logout_user'
  get 'app(/*all)', to: 'home#index'
  # Where a DM enters the code a Foundry module shows, to link it to their account
  get 'link', to: 'home#index'
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
      get '/maps/:id/presign_upload', to: 'foundry_maps#presign_upload'
      post '/maps/:id/process_s3_upload', to: 'foundry_maps#process_s3_upload'
      post '/maps/upload_image', to: 'foundry_maps#upload_image'
      delete '/maps/:id/files/:file_id', to: 'foundry_maps#delete_file'
      resources :foundry_maps, path: 'maps', except: %i[new edit], constraints: { format: 'json' }

      # Foundry Map Tags CRUD
      resources :foundry_map_tags, path: 'map-tags', only: %i[index create update destroy], constraints: { format: 'json' }

      # Patreon OAuth endpoints
      get '/users/:user_id/ready', to: 'patreon_auth#check_status', constraints: { format: 'json' }
      get '/patreon/callback', to: 'patreon_auth#callback'
      # Patreon membership events, signed with PATREON_WEBHOOK_SECRET
      post '/patreon/webhook', to: 'patreon_webhooks#create'

      # Patreon account linked to the signed-in user (web app)
      resource :patreon_link, path: 'patreon/link', only: %i[show create destroy], constraints: { format: 'json' }

      # Personal API tokens for Foundry modules
      resources :api_tokens, path: 'api-tokens', only: %i[index create destroy], constraints: { format: 'json' }

      # The signed-in DM approves or denies a Foundry module's device-link code
      get 'device-links/:user_code', to: 'device_links#show', constraints: { format: 'json' }
      post 'device-links/:user_code/approve', to: 'device_links#approve', constraints: { format: 'json' }
      post 'device-links/:user_code/deny', to: 'device_links#deny', constraints: { format: 'json' }

      # Search the signed-in DM's Foundry compendium index
      get 'compendium', to: 'compendium_entries#index', constraints: { format: 'json' }
      get 'compendium/packs', to: 'compendium_entries#packs', constraints: { format: 'json' }

      # The signed-in DM's player characters from Foundry
      get 'player-characters', to: 'player_characters#index', constraints: { format: 'json' }

      # The signed-in DM's Foundry scenes (with thumbnails), for picking maps
      get 'foundry_scenes', to: 'foundry_scenes#index', constraints: { format: 'json' }

      # Campaign planner (the signed-in DM's own campaigns)
      resources :campaigns, only: %i[index show create update destroy], constraints: { format: 'json' } do
        scope module: :campaigns do
          resources :factions, :locations, :npcs, :fronts, :secrets, :references,
                    only: %i[index show create update destroy]
          resources :quests, only: %i[index show create update destroy] do
            resources :links, controller: 'quest_links', only: %i[create update destroy]
          end
          resources :sessions, only: %i[index show create update destroy] do
            resources :links, controller: 'session_links', only: %i[create update destroy]
          end
        end
      end

      # Endpoints for Foundry modules, authenticated with a personal API token
      namespace :foundry do
        get 'me', to: 'accounts#show', constraints: { format: 'json' }
        get 'campaigns', to: 'campaigns#index', constraints: { format: 'json' }
        post 'campaigns', to: 'campaigns#create', constraints: { format: 'json' }
        post 'campaigns/import', to: 'campaigns#import', constraints: { format: 'json' }
        get 'campaigns/:uuid/changes', to: 'campaigns#changes', constraints: { format: 'json' }
        post 'campaigns/:uuid/changes', to: 'campaigns#push', constraints: { format: 'json' }
        post 'characters', to: 'characters#create', constraints: { format: 'json' }
        get 'scenes', to: 'scenes#index', constraints: { format: 'json' }
        post 'scenes', to: 'scenes#create', constraints: { format: 'json' }
        delete 'scenes', to: 'scenes#destroy', constraints: { format: 'json' }
        get 'compendium', to: 'compendium#show', constraints: { format: 'json' }
        post 'compendium', to: 'compendium#create', constraints: { format: 'json' }

        # Device-code linking: no token yet, this is how a module gets one
        post 'link', to: 'links#create', constraints: { format: 'json' }
        post 'link/token', to: 'links#token', constraints: { format: 'json' }
      end

      # Admin UI for managing maps
      get '/maps-admin', to: 'foundry_maps_admin#index'

      # Foundry module install statistics (GitHub releases proxy)
      get '/foundry-module-stats', to: 'foundry_module_stats#index',
                                   constraints: { format: 'json' }

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
