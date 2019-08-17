# frozen_string_literal: true

Rails.application.routes.draw do
  resources :characters, param: :slug
  # noinspection RailsParamDefResolve
  resources :player_characters, param: :slug, controller: 'characters', type: 'PlayerCharacter'
  # noinspection RailsParamDefResolve
  resources :non_player_characters, param: :slug, controller: 'characters', type: 'NonPlayerCharacter'
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
  resources :spells, param: :slug
  resources :campaigns, param: :slug do
    resources :adventures do
      resources :encounters
    end
  end
  devise_for :users, controllers: { registrations: 'registrations' }
  root to: 'home#index'
  get 'home', to: 'home#index'

  get 'dashboard', to: 'dashboard#index'
  resources :users, except: %i[create new], param: :slug
  patch '/users/:id/change_role', to: 'users#change_role', as: 'user_change_role'
  patch '/campaigns/:id/join_campaign/:user_id', to: 'campaigns#join_campaign', as: 'campaign_join_campaign'
  patch '/campaigns/:id/confirm_user/:user_id', to: 'campaigns#confirm_user', as: 'campaign_confirm_user'
  get '/characters/new/generate_npc', to: 'characters#generate_npc', as: 'generate_npc'
  post '/characters/create_generated_npc', to: 'characters#create_generated_npc',
                                           as: 'create_generated_npc'
  get '/random_fantasy_name', to: 'characters#random_fantasy_name', as: 'random_fantasy_name', constraints: { format: 'json' }
  get '/random_individual_treasure', to: 'encounters#random_individual_treasure', as: 'random_individual_treasure', constraints: { format: 'json' }
end
