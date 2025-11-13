# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Allow requests from FoundryVTT (running on different ports/origins)
    origins '*' # In production, lock this down to specific origins

    resource '/v1/maps/*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization']

    resource '/v1/users/*',
      headers: :any,
      methods: [:get, :post, :options, :head]

    resource '/v1/patreon/*',
      headers: :any,
      methods: [:get, :post, :options, :head]
  end
end
