Rails.application.routes.draw do

  root to: 'home#index'

  resources :users, except: %i[create new destroy], param: :slug
  patch '/users/:id/change_role', to: 'users#change_role', as: 'user_change_role'
  post '/users/login', to: 'users#set_auth_user', as: 'user_set_user'
  delete '/users/logout', to: 'users#logout_user', as: 'user_logout_user'
  get 'app(/*all)', to: 'home#index'
  scope module: 'admin' do
    namespace :v1 do
      get 'dashboard', to: 'dashboard#index'
      get '/custom_actions', to: 'dashboard#custom_actions',
          constraints: { format: 'json' }
      post '/create_action', to: 'dashboard#create_action',
           constraints: { format: 'json' }
      put '/update_action', to: 'dashboard#update_action',
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
      post '/generate_monster', to: 'monsters#generate_monster',
           as: 'generate_monster',
           constraints: { format: 'json' }
      post '/quick_monster', to: 'monsters#quick_monster',
           as: 'quick_monster',
           constraints: { format: 'json' }
      post '/generate_commoner', to: 'monsters#generate_commoner',
          as: 'generate_commoner',
          constraints: { format: 'json' }
      get '/monster-categories', to: 'monsters#monster_categories',
          as: 'monster_categories',
          constraints: { format: 'json' }
      get '/actions-by-name', to: 'monsters#actions_by_name',
          as: 'actions_by_name',
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
      get '/prof-skills', to: 'proficiencies#skills',
          as: 'proficiency_skills',
          constraints: { format: 'json' }
      get '/saving-throws', to: 'proficiencies#saving_throws',
          as: 'proficiency_saving_throws',
          constraints: { format: 'json' }
      scope except: [:new, :edit] do
        resources :conditions, only: [:index, :show], constraints: { format: 'json' }
        resources :proficiencies, only: [:index, :show], constraints: { format: 'json' }
        resources :skills, only: [:index, :show], constraints: { format: 'json' }
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
        resources :spells
        resources :sections
      end
    end
  end
end
