# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'home#index'
  devise_for :users, controllers: { registrations: 'registrations', sessions: 'sessions' }

  resources :users, except: %i[create new], param: :slug
  patch '/users/:id/change_role', to: 'users#change_role', as: 'user_change_role'
  get "app(/*all)", to: "home#index"
  scope module: 'admin' do
    namespace :v1 do
      get 'dashboard', to: 'dashboard#index'
      resources :campaigns, param: :slug do
        resources :adventures do
          resources :encounters
        end
        resources :guilds, param: :slug do
          resources :characters, param: :slug
          # noinspection RailsParamDefResolve
          resources :player_characters, param: :slug, controller: 'characters', type: 'PlayerCharacter'
          # noinspection RailsParamDefResolve
          resources :non_player_characters, param: :slug, controller: 'characters', type: 'NonPlayerCharacter'
          get '/characters/new/generate_npc', to: 'characters#generate_npc', as: 'generate_npc'
          post '/characters/create_generated_npc', to: 'characters#create_generated_npc',
               as: 'create_generated_npc'
        end

      end
      get '/random_fantasy_name', to: 'characters#random_fantasy_name',
          as: 'random_fantasy_name',
          constraints: { format: 'json' }
      get '/random_individual_treasure',
          to: 'encounters#random_individual_treasure',
          as: 'random_individual_treasure', constraints: { format: 'json' }
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
