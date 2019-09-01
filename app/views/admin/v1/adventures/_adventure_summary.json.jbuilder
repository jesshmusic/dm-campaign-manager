# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! adventure, :id, :name, :description

json.encounters adventure.encounters do |encounter|
  json.partial! 'admin/v1/encounters/encounter', encounter: encounter, adventure: adventure, campaign: campaign
end

json.url v1_campaign_adventure_url(campaign, adventure, format: :json)
