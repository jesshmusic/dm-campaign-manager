Rails.application.routes.draw do
  resources :treasures
  resources :dnd_classes, param: :slug
  resources :items, param: :slug
  resources :magic_items, param: :slug
  resources :monsters, param: :slug
  resources :spells, param: :slug
  resources :campaigns, param: :slug
  devise_for :users, :controllers => { registrations: 'registrations' }
  root to: 'home#index'
  get 'home', to: 'home#index'
  
  get 'dashboard', to: 'dashboard#index'
  resources :users, except: %i[create new], param: :slug
  patch '/users/:id/change_role', to: 'users#change_role', as: 'user_change_role'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  
  # SRD API imports
end
