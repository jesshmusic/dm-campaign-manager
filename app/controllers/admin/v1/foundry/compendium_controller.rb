# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # The DM's compendium index, sent by Dorman Lakely's Campaign Planner so
      # planner searches can link straight to Foundry compendium entries.
      class CompendiumController < BaseController
        ENTRY_FIELDS = %i[uuid name category challengeRating detail].freeze

        # GET /v1/foundry/compendium
        # What Dungeon Master Guru has, so the module only sends packs that changed
        def show
          versions = @user.compendium_entries.group(:pack, :pack_version).count
          render json: { packs: versions.to_h { |(pack, version), count| [pack, { version: version, count: count }] } }
        end

        # POST /v1/foundry/compendium
        # Body: { pack, version, entries: [{ uuid, name, category, challengeRating, detail }] }
        # Replaces everything from that pack.
        def create
          pack = params[:pack].to_s
          unless CompendiumEntry::PACKS.key?(pack)
            return render json: { errors: ["#{pack} isn't a supported compendium"] }, status: :unprocessable_entity
          end

          entries = params[:entries]
          return render json: { errors: ['entries must be a list'] }, status: :unprocessable_entity unless entries.is_a?(Array)

          permitted = entries.map { |entry| entry.respond_to?(:permit) ? entry.permit(*ENTRY_FIELDS).to_h : {} }
          count = CompendiumEntry.replace_pack!(@user, pack, params[:version].to_s.first(64).presence, permitted)
          render json: { pack: pack, count: count, skipped: entries.size - count }
        end
      end
    end
  end
end
