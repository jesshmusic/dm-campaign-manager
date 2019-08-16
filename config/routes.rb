# frozen_string_literal: true

Rails.application.routes.draw do
  resources :adventures, only: [:show, :edit, :update, :destroy]
  resources :encounters, only: [:show, :edit, :update, :destroy]
  resources :characters, param: :slug
  resources :player_characters, param: :slug, controller: 'characters', type: 'PlayerCharacter'
  resources :non_player_characters, param: :slug, controller: 'characters', type: 'NonPlayerCharacter'
  resources :dnd_classes, param: :slug
  resources :items, param: :slug
  resources :armor_items, param: :slug, controller: 'items', type: 'ArmorItem'
  resources :gear_items, param: :slug, controller: 'items', type: 'GearItem'
  resources :magic_items, param: :slug, controller: 'items', type: 'MagicItem'
  resources :tool_items, param: :slug, controller: 'items', type: 'ToolItem'
  resources :vehicle_items, param: :slug, controller: 'items', type: 'VehicleItem'
  resources :weapon_items, param: :slug, controller: 'items', type: 'WeaponItem'
  resources :monsters, param: :slug
  resources :spells, param: :slug
  resources :campaigns, param: :slug
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
