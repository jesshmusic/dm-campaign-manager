# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # Device-code linking for Foundry modules (see DeviceLink). Unauthenticated:
      # the module has no token yet, and this is how it gets one.
      class LinksController < ApplicationController
        START_LIMIT_PER_MINUTE = 10

        # Called cross-origin by Foundry without a session, so CSRF does not apply
        skip_before_action :verify_authenticity_token
        wrap_parameters false

        before_action :limit_start_rate, only: :create

        # POST /v1/foundry/link
        # Body (optional): { world: { id, title } }
        def create
          world = params[:world].respond_to?(:key?) ? params[:world] : {}
          link = DeviceLink.start!(world_id: world[:id], world_title: world[:title])
          verification_url = "#{request.base_url}/link"
          render json: {
            deviceCode: link.device_code,
            userCode: link.display_user_code,
            verificationUrl: verification_url,
            verificationUrlComplete: "#{verification_url}?code=#{link.display_user_code}",
            expiresIn: DeviceLink::LIFETIME.to_i,
            interval: DeviceLink::POLL_INTERVAL
          }, status: :created
        end

        # POST /v1/foundry/link/token
        # Body: { deviceCode }
        def token
          link = DeviceLink.for_device_code(params[:deviceCode].presence || params[:device_code])
          return poll_error('expired_token') unless link

          status, api_token = link.poll!
          case status
          when :approved
            render json: { token: api_token.plaintext_token, user: { name: link.user.name.presence || link.user.username } }
          when :pending then poll_error('authorization_pending')
          when :slow_down then poll_error('slow_down')
          when :denied then poll_error('access_denied')
          else poll_error('expired_token')
          end
        end

        private

        def poll_error(error)
          render json: { error: error }, status: :bad_request
        end

        # A fixed one-minute window per IP address
        def limit_start_rate
          window = Time.current.to_i / 60
          key = "device_links:start:#{request.remote_ip}:#{window}"
          count = Rails.cache.increment(key, 1, expires_in: 2.minutes).to_i
          return if count <= START_LIMIT_PER_MINUTE

          response.set_header('Retry-After', (60 - (Time.current.to_i % 60)).to_s)
          render json: { error: 'rate_limited', errors: ['Too many link requests. Try again in a minute.'] },
                 status: :too_many_requests
        end
      end
    end
  end
end
