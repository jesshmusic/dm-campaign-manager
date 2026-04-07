# frozen_string_literal: true

module Admin
  module V1
    class FoundryModuleStatsController < SecuredController
      CACHE_KEY = 'foundry_module_stats/v2'
      CACHE_TTL = 15.minutes

      def index
        authorize :foundry_module_stats, :index?

        Rails.cache.delete(CACHE_KEY) if ActiveModel::Type::Boolean.new.cast(params[:refresh])

        cached = Rails.cache.read(CACHE_KEY)
        if cached
          render json: cached
          return
        end

        stats = FoundryModuleStatsFetcher.new.call

        # Don't poison the cache with a rate-limited response — return it
        # live to the caller so the next request can retry once GitHub's
        # bucket refills.
        Rails.cache.write(CACHE_KEY, stats, expires_in: CACHE_TTL) unless stats[:rate_limited]

        render json: stats
      end
    end
  end
end
