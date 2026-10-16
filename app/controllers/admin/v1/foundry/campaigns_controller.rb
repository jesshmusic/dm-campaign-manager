# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # Campaigns for Dorman Lakely's Campaign Planner. Creating one is free, as
      # it is on the website; listing and syncing them are Patreon premium.
      class CampaignsController < BaseController
        UUID_FORMAT = /\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/
        REQUEST_ID_FORMAT = /\A[\w-]{8,64}\z/

        before_action :require_premium!, except: :create
        before_action :set_campaign, except: %i[index create]

        # GET /v1/foundry/campaigns
        def index
          campaigns = @user.campaigns.order(updated_at: :desc)
          render json: campaigns.map { |campaign|
            { uuid: campaign.uuid, name: campaign.name, slug: campaign.slug, mode: campaign.mode,
              status: campaign.status, syncVersion: campaign.sync_counter }
          }
        end

        # POST /v1/foundry/campaigns
        # Body: { template, campaign: {...}, party: { world: { id, title }, characters: [...] }, request_id }
        # The party's characters are saved first, like POST /v1/foundry/characters
        # does. Sending the same request_id again (a retry after a timeout)
        # returns the campaign it already made.
        def create
          created = Rails.cache.read(request_key) if request_key
          return render json: created_json(@user.campaigns.find(created)) if created && @user.campaigns.exists?(created)

          campaign = CampaignCreator.new(@user).create!(params.require(:campaign).permit(*CampaignCreator::ATTRIBUTES),
                                                        template: params[:template], party_ids: party_character_ids)
          Rails.cache.write(request_key, campaign.id, expires_in: 1.hour) if request_key
          render json: created_json(campaign), status: :created
        rescue CampaignCreator::UnknownTemplate
          render json: { errors: ['Unknown template'], fields: ['template'] }, status: :unprocessable_entity
        rescue ActiveRecord::RecordInvalid => e
          render json: { errors: e.record.errors.full_messages, fields: e.record.errors.attribute_names.map(&:to_s) },
                 status: :unprocessable_entity
        end

        # GET /v1/foundry/campaigns/:uuid/changes?since=N
        def changes
          render json: CampaignSync.new(@campaign).changes_since(params[:since].to_i.clamp(0, nil))
        end

        # POST /v1/foundry/campaigns/:uuid/changes
        # Body: { changes: [{ type, uuid, baseVersion, attributes: {...} }] }
        def push
          changes = params.require(:changes)
          return render json: { errors: ['changes must be a list'] }, status: :unprocessable_entity unless changes.is_a?(Array)

          render json: CampaignSync.new(@campaign).apply(changes.map { |change| change.permit!.to_h })
        end

        private

        def request_key
          request_id = params[:request_id].to_s
          "foundry-campaign-create/#{@user.id}/#{request_id}" if request_id.match?(REQUEST_ID_FORMAT)
        end

        # Saves the party's characters from the world and returns their ids
        def party_character_ids
          party = params[:party]
          return unless party.respond_to?(:key?)

          world = party[:world]
          world_id = world.respond_to?(:key?) ? world[:id].to_s : ''
          characters = party[:characters]
          return [] unless world_id.match?(PlayerCharacter::WORLD_ID_FORMAT) && characters.is_a?(Array)

          hashes = characters.map { |character| character.respond_to?(:to_unsafe_h) ? character.to_unsafe_h.to_h : {} }
          title = world[:title].to_s.squish.first(200).presence
          PlayerCharacter.save_from_world!(@user, world_id, title, hashes).map(&:id)
        end

        def created_json(campaign)
          { uuid: campaign.uuid, name: campaign.name, slug: campaign.slug, mode: campaign.mode, status: campaign.status,
            syncVersion: campaign.sync_counter, url: "/app/campaigns/#{campaign.slug}", party: campaign.party.pluck(:name) }
        end

        def set_campaign
          uuid = params[:uuid].to_s
          @campaign = @user.campaigns.find_by(uuid: uuid) if uuid.match?(UUID_FORMAT)
          render json: { errors: ['Campaign not found'] }, status: :not_found unless @campaign
        end
      end
    end
  end
end
