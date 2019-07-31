Rails.application.routes.draw do
  resources :campaigns
  devise_for :users, :controllers => { registrations: 'registrations' }
  root to: 'hello_world#index'
  get 'hello_world', to: 'hello_world#index'
  
  get 'dashboard', to: 'dashboard#index'
  resources :users, except: %i[create new]
  patch '/users/:id/change_role', to: 'users#change_role', as: 'user_change_role'
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
