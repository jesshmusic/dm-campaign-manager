require 'net/http'
require 'json'

module Admin
  module V1
    class PatreonAuthController < ApplicationController
      skip_before_action :verify_authenticity_token

      # GET /v1/users/:user_id/ready
      def check_status
        user_id = params[:user_id]
        user = PatreonUser.find_by(user_id: user_id)

        if user&.authenticated?
          render json: user.as_json_for_api
        else
          head :not_found
        end
      end

      # GET /v1/patreon/callback
      # This is where Patreon redirects after OAuth authorization
      def callback
        code = params[:code]
        state = params[:state] # This is the user_id from Foundry

        unless code && state
          return render html: '<h1>Error: Missing authorization code or state</h1>', status: :bad_request
        end

        begin
          # Exchange code for access token
          token_response = exchange_code_for_token(code)

          # Fetch user's Patreon membership info
          patreon_data = fetch_patreon_membership(token_response['access_token'])

          # Determine tier
          tier_cents = patreon_data.dig('included', 0, 'attributes', 'currently_entitled_amount_cents') || 0

          # Create or update PatreonUser
          user = PatreonUser.find_or_initialize_by(user_id: state)
          user.update_from_patreon!(
            patreon_id: patreon_data.dig('data', 'id'),
            email: patreon_data.dig('data', 'attributes', 'email'),
            name: patreon_data.dig('data', 'attributes', 'full_name'),
            has_free: true,
            has_premium: tier_cents >= 500, # $5+ tier
            expires_at: 30.days.from_now,
            access_token: token_response['access_token'],
            refresh_token: token_response['refresh_token']
          )

          # Return success page
          render html: <<~HTML
            <!DOCTYPE html>
            <html>
            <head>
              <title>Authentication Successful</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background: #2b2b2b;
                  color: #e0e0e0;
                }
                .container {
                  text-align: center;
                  padding: 2rem;
                  background: #3a3a3a;
                  border-radius: 8px;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                h1 { color: #52c41a; margin-bottom: 1rem; }
                p { font-size: 1.1rem; margin-bottom: 1.5rem; }
                .tier { color: #{user.has_premium ? '#ffd700' : '#95de64'}; font-weight: bold; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>✓ Authentication Successful!</h1>
                <p>Access Level: <span class="tier">#{user.has_premium ? 'Premium' : 'Free'}</span></p>
                <p>You can close this window and return to FoundryVTT.</p>
              </div>
              <script>
                // Auto-close after 3 seconds
                setTimeout(() => window.close(), 3000);
              </script>
            </body>
            </html>
          HTML
        rescue => e
          Rails.logger.error("Patreon OAuth Error: #{e.message}")
          Rails.logger.error(e.backtrace.join("\n"))
          render html: "<h1>Authentication Failed</h1><p>#{e.message}</p>", status: :internal_server_error
        end
      end

      private

      def exchange_code_for_token(code)
        uri = URI('https://www.patreon.com/api/oauth2/token')
        response = Net::HTTP.post_form(uri,
          'code' => code,
          'grant_type' => 'authorization_code',
          'client_id' => ENV['PATREON_CLIENT_ID'],
          'client_secret' => ENV['PATREON_CLIENT_SECRET'],
          'redirect_uri' => ENV['PATREON_REDIRECT_URI']
        )

        unless response.is_a?(Net::HTTPSuccess)
          raise "Failed to exchange code: #{response.body}"
        end

        JSON.parse(response.body)
      end

      def fetch_patreon_membership(access_token)
        uri = URI('https://www.patreon.com/api/oauth2/v2/identity')
        uri.query = URI.encode_www_form(
          'include' => 'memberships',
          'fields[member]' => 'patron_status,currently_entitled_amount_cents',
          'fields[user]' => 'email,full_name'
        )

        request = Net::HTTP::Get.new(uri)
        request['Authorization'] = "Bearer #{access_token}"

        response = Net::HTTP.start(uri.hostname, uri.port, use_ssl: true) do |http|
          http.request(request)
        end

        unless response.is_a?(Net::HTTPSuccess)
          raise "Failed to fetch membership: #{response.body}"
        end

        JSON.parse(response.body)
      end
    end
  end
end
