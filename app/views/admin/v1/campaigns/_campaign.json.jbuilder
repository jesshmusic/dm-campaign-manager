# frozen_string_literal: true

json.extract! campaign, :id, :name, :description, :world

json.url campaign_url(campaign, format: :json)
