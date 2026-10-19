# frozen_string_literal: true

module Admin
  module V1
    # The signed-in DM's Foundry compendium index (see CompendiumEntry)
    class CompendiumEntriesController < SecuredController
      include SignedInUser

      # GET /v1/compendium?search=zombie&categories=monster,spell&campaign=the-grey-plague
      # With a campaign, only its compendiums. `indexed` is false when there
      # is nothing to search, so the planner can search DM Guru's SRD instead.
      def index
        entries = @user.compendium_entries
        campaign = params[:campaign].presence && @user.campaigns.find_by(slug: params[:campaign])
        entries = entries.where.not(pack: campaign.excluded_compendium_packs) if campaign
        categories = params[:categories].to_s.split(',') & CompendiumEntry::CATEGORIES
        render json: {
          indexed: entries.exists?,
          results: entries.search(params[:search].to_s, categories: categories).map(&:as_json_for_api)
        }
      end

      # GET /v1/compendium/packs
      def packs
        render json: @user.compendium_entries.pack_summaries
      end
    end
  end
end
