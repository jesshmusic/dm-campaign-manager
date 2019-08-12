# frozen_string_literal: true

Rails.application.routes.draw do
  resources :characters, param: :slug
  resources :treasures
  resources :dnd_classes, param: :slug
  resources :items, param: :slug
  resources :magic_items, param: :slug
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
end
