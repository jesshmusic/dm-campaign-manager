Rails.application.routes.draw do
  root to: 'home#index'
  devise_for :users, controllers: { registrations: 'registrations', sessions: 'sessions' }

  resources :users, except: %i[create new], param: :slug
  patch '/users/:id/change_role', to: 'users#change_role', as: 'user_change_role'
  get "app(/*all)", to: "home#index"
  scope module: 'admin' do
    namespace :v1 do
      get 'dashboard', to: 'dashboard#index'
      get '/random_fantasy_name', to: 'characters#random_fantasy_name',
          as: 'random_fantasy_name',
          constraints: { format: 'json' }
      get '/random_tavern_name', to: 'characters#random_tavern_name',
          as: 'random_tavern_name',
          constraints: { format: 'json' }
      post '/generate_npc', to: 'characters#generate_npc',
           as: 'generate_npc',
           constraints: { format: 'json' }
      post '/convert_2e_npc', to: 'characters#convert_2e_npc',
           as: 'convert_2e_npc',
           constraints: { format: 'json' }
      get '/generate_commoner', to: 'characters#generate_commoner',
          as: 'generate_commoner',
          constraints: { format: 'json' }
      get '/monster-categories', to: 'monsters#monster_categories',
          as: 'monster_categories',
          constraints: { format: 'json' }
      resources :dnd_classes, param: :slug
      resources :items, param: :slug
      # noinspection RailsParamDefResolve
      resources :armor_items, param: :slug, controller: 'items', type: 'ArmorItem'
      # noinspection RailsParamDefResolve
      resources :gear_items, param: :slug, controller: 'items', type: 'GearItem'
      # noinspection RailsParamDefResolve
      resources :magic_items, param: :slug, controller: 'items', type: 'MagicItem'
      # noinspection RailsParamDefResolve
      resources :tool_items, param: :slug, controller: 'items', type: 'ToolItem'
      # noinspection RailsParamDefResolve
      resources :vehicle_items, param: :slug, controller: 'items', type: 'VehicleItem'
      # noinspection RailsParamDefResolve
      resources :weapon_items, param: :slug, controller: 'items', type: 'WeaponItem'
      resources :monsters, param: :slug
      resources :races, param: :slug
      resources :spells, param: :slug
    end
  end
end
