# frozen_string_literal: true
#
json.array! @campaigns do |campaign|
  json.id campaign.id
  json.name campaign.name
  json.description campaign.description
  json.world campaign.world
  json.slug campaign.slug

  json.user do
    json.id campaign.user.id
    json.name campaign.user.name
    json.username campaign.user.username
    json.role campaign.user.role
    json.location campaign.user.location
  end

  json.worldLocations campaign.world_locations do |world_location|
    json.partial! 'admin/v1/campaigns/world_location', world_location: world_location
  end

  json.worldEvents campaign.world_events do |world_event|
    json.partial! 'admin/v1/campaigns/world_event', world_event: world_event
  end

  json.adventures campaign.adventures do |adventure|
    json.id adventure.id
    json.name adventure.name
    json.description adventure.description

    json.encounters adventure.encounters do |encounter|
      json.partial! 'admin/v1/encounters/encounter', encounter: encounter
    end
  end

  json.isDmCampaign campaign.user.id == @current_user&.id
end