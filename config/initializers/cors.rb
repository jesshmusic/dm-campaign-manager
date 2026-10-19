# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin AJAX requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # Foundry modules call these from each DM's own Foundry server, at any
    # address, so any origin is allowed, but only on the paths below. They're
    # token- or key-authenticated, not cookie-based. The rest of the API isn't
    # open to other origins.
    origins '*'

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

    resource '/v1/foundry/*',
      headers: :any,
      methods: [:get, :post, :patch, :delete, :options, :head]

    # The setup guide's words, which the campaign planner module reads
    resource '/v1/setup_guide',
      headers: :any,
      methods: [:get, :options, :head]
  end
end
