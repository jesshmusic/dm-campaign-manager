# frozen_string_literal: true

module Admin
  module V1
    class FoundryModuleStatsController < SecuredController
      CACHE_KEY = 'foundry_module_stats/v1'
      CACHE_TTL = 5.minutes

      def index
        authorize :foundry_module_stats, :index?

        Rails.cache.delete(CACHE_KEY) if params[:refresh].present?

        stats = Rails.cache.fetch(CACHE_KEY, expires_in: CACHE_TTL) do
          FoundryModuleStatsFetcher.new.call
        end

        render json: stats
      end
    end
  end
end
