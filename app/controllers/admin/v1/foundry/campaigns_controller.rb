# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # Campaigns for Dorman Lakely's Campaign Planner: create them (or send one
      # planned in Foundry), list them, and sync their changes.
      class CampaignsController < BaseController
        UUID_FORMAT = /\A\h{8}-\h{4}-\h{4}-\h{4}-\h{12}\z/
        REQUEST_ID_FORMAT = /\A[\w-]{8,64}\z/
        UPDATE_MODULE = "This version of Dorman Lakely's Campaign Planner is too old to sync with Dungeon Master " \
                        "Guru. Update it in Foundry's Add-on Modules, then try again."

        before_action :require_current_module
        before_action :set_campaign, except: %i[index create import]

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

          campaign = CampaignCreator.new(@user).create!(CampaignCreator.permit(params.require(:campaign)),
                                                        template: params[:template], party_ids: party_character_ids)
          Rails.cache.write(request_key, campaign.id, expires_in: 1.hour) if request_key
          render json: created_json(campaign), status: :created
        rescue CampaignCreator::UnknownTemplate
          render json: { errors: ['Unknown template'], fields: ['template'] }, status: :unprocessable_entity
        rescue ActiveRecord::RecordInvalid => e
          render json: { errors: e.record.errors.full_messages, fields: e.record.errors.attribute_names.map(&:to_s) },
                 status: :unprocessable_entity
        end

        # POST /v1/foundry/campaigns/import
        # Body: { campaign: {...}, records: { factions: [...], ..., secrets: [...] }, party: {...}, request_id }
        # "Send to Dungeon Master Guru" for a campaign planned in Foundry: creates
        # it with all its records (see CampaignImporter), and returns it with
        # ids: { local id => new uuid }. The party and request_id work as in create.
        def import
          done = Rails.cache.read(request_key) if request_key
          campaign = @user.campaigns.find_by(id: done[:campaign_id]) if done.is_a?(Hash)
          return render json: imported_json(campaign, done[:ids]) if campaign

          importer = CampaignImporter.new(@user)
          # The party's characters too, so a failure saves nothing
          campaign = Campaign.transaction do
            importer.import!(params[:campaign], params[:records], party_ids: party_character_ids)
          end
          Rails.cache.write(request_key, { campaign_id: campaign.id, ids: importer.ids }, expires_in: 1.hour) if request_key
          render json: imported_json(campaign.reload, importer.ids), status: :created
        rescue CampaignImporter::Invalid => e
          render json: { errors: e.errors }, status: :unprocessable_entity
        end

        # GET /v1/foundry/campaigns/:uuid/changes?since=N
        def changes
          render json: CampaignSync.new(@campaign).changes_since(params[:since].to_i.clamp(0, nil))
        end

        # POST /v1/foundry/campaigns/:uuid/changes
        # Body: { changes: [{ op?, type, uuid, baseVersion, attributes: {...} }] }, op being
        # update (the default), create or delete. Responds { applied, conflicts, errors, deleted, cursor }.
        def push
          changes = params.require(:changes)
          return render json: { errors: ['changes must be a list'] }, status: :unprocessable_entity unless changes.is_a?(Array)

          render json: CampaignSync.new(@campaign).apply(changes.map { |change| change.respond_to?(:permit!) ? change.permit!.to_h : change })
        end

        private

        def request_key
          request_id = params[:request_id].to_s
          "foundry-campaign-#{action_name}/#{@user.id}/#{request_id}" if request_id.match?(REQUEST_ID_FORMAT)
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

        def imported_json(campaign, ids)
          campaign.as_json_for_api.merge(created_json(campaign), ids: ids)
        end

        # A module that speaks an older shape of campaign data than the sync
        # still takes is asked to update (see CampaignSync::SCHEMA_VERSION)
        def require_current_module
          schema = Integer(request.headers['X-Planner-Schema'].to_s, exception: false) || 1
          return if schema >= CampaignSync::MIN_CLIENT_SCHEMA

          render json: { errors: [UPDATE_MODULE], code: 'update_module', schemaVersion: CampaignSync::SCHEMA_VERSION },
                 status: :upgrade_required
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
