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
        # The user_id from Foundry, or a signed PatreonLinkState from the web app
        state = params[:state]

        return render html: '<h1>Error: Missing authorization code or state</h1>', status: :bad_request unless code && state
        return link_account(code, state) if PatreonLinkState.link_state?(state)

        begin
          attributes = membership_attributes_for(code)

          # Create or update PatreonUser
          user = PatreonUser.find_or_initialize_by(user_id: state)
          user.update_from_patreon!(attributes)
          tier_label = ERB::Util.html_escape(user.tier_name || 'Free')

          # Return success page
          render html: <<~HTML.html_safe
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
                <p>Access Level: <span class="tier">#{tier_label}</span></p>
                <p>You can close this window and return to FoundryVTT.</p>
              </div>
              <script>
                // Auto-close after 3 seconds
                setTimeout(() => {
                  window.close();
                  // If window.close() doesn't work, try closing the popup
                  if (!window.closed) {
                    window.open('', '_self', '');
                    window.close();
                  }
                }, 3000);
              </script>
            </body>
            </html>
          HTML
        rescue StandardError => e
          Rails.logger.error("Patreon OAuth Error: #{e.message}")
          Rails.logger.error(e.backtrace.join("\n"))
          render html: '<h1>Authentication Failed</h1><p>Something went wrong while connecting to Patreon. Please try again.</p>'.html_safe,
                 status: :internal_server_error
        end
      end

      private

      # Web app flow: link the Patreon account to the DM Guru user named in the
      # signed state, then send them back to their dashboard.
      def link_account(code, state)
        user = PatreonLinkState.user_for(state)
        return redirect_to(link_result_path('expired')) unless user

        attributes = membership_attributes_for(code)

        # One Patreon account can back only one DM Guru account
        if PatreonUser.where.not(linked_user_id: nil).where.not(linked_user_id: user.id).exists?(patreon_id: attributes[:patreon_id])
          return redirect_to(link_result_path('already_linked'))
        end

        PatreonUser.find_or_initialize_by(linked_user: user).update_from_patreon!(attributes)
        redirect_to link_result_path('linked')
      rescue StandardError => e
        Rails.logger.error("Patreon link error: #{e.message}")
        redirect_to link_result_path('error')
      end

      def link_result_path(result)
        "/app/user-dashboard?patreon=#{result}"
      end

      # Exchanges the authorization code for tokens and reads the patron's membership
      def membership_attributes_for(code)
        token_response = PatreonClient.exchange_code(code)
        PatreonMembership.attributes(token_response, PatreonClient.identity(token_response['access_token']))
      end
    end
  end
end
