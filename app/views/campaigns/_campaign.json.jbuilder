# frozen_string_literal: true

json.extract! campaign, :id, :name, :description, :world, :created_at, :updated_at
json.url campaign_url(campaign, format: :json)
