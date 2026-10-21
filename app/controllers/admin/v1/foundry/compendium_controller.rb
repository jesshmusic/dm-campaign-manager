# frozen_string_literal: true

module Admin
  module V1
    module Foundry
      # The DM's compendium index, sent by Dorman Lakely's Campaign Planner so
      # planner searches can link straight to Foundry compendium entries: the
      # SRD and 2024 core book packs, and the DM's homebrew (see CompendiumEntry).
      class CompendiumController < BaseController
        ENTRY_FIELDS = %i[uuid name category challengeRating detail].freeze

        # GET /v1/foundry/compendium
        # What Dungeon Master Guru has, so the module only sends packs that changed
        def show
          versions = @user.compendium_entries.group(:pack, :pack_version).count
          render json: { packs: versions.to_h { |(pack, version), count| [pack, { version: version, count: count }] } }
        end

        # POST /v1/foundry/compendium
        # Body: { pack, version, entries: [{ uuid, name, category, challengeRating, detail }] }, and for
        # a homebrew pack also homebrew: true and label (its title). Replaces everything from that pack;
        # an empty list removes it.
        def create
          pack = params[:pack].to_s
          problem = pack_problem(pack)
          return render json: { errors: [problem] }, status: :unprocessable_entity if problem

          entries = params[:entries]
          return render json: { errors: ['entries must be a list'] }, status: :unprocessable_entity unless entries.is_a?(Array)

          permitted = entries.map { |entry| entry.respond_to?(:permit) ? entry.permit(*ENTRY_FIELDS).to_h : {} }
          count = CompendiumEntry.replace_pack!(@user, pack, params[:version].to_s.first(64).presence, permitted, label: label)
          render json: { pack: pack, count: count, skipped: entries.size - count }
        end

        private

        def homebrew?
          ActiveModel::Type::Boolean.new.cast(params[:homebrew]) == true
        end

        def label
          params[:label].to_s.squish.presence
        end

        # Why the pack can't be indexed, or nil
        def pack_problem(pack)
          return if CompendiumEntry::PACKS.key?(pack)
          return "#{pack.truncate(100)} isn't a supported compendium" unless homebrew? && CompendiumEntry.pack_id?(pack)
          return if Array(params[:entries]).empty?
          return 'label must be the compendium\'s title' if label.nil?
          return "label is too long (maximum is #{CompendiumEntry::MAX_PACK_LABEL} characters)" if label.length > CompendiumEntry::MAX_PACK_LABEL

          too_many_homebrew_packs?(pack) ? "No more than #{CompendiumEntry::MAX_HOMEBREW_PACKS} homebrew compendiums" : nil
        end

        def too_many_homebrew_packs?(pack)
          packs = @user.compendium_entries.where(homebrew: true).distinct.pluck(:pack)
          packs.exclude?(pack) && packs.size >= CompendiumEntry::MAX_HOMEBREW_PACKS
        end
      end
    end
  end
end
