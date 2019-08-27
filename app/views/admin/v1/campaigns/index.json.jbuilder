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
    json.id = world_location.id
    json.name = world_location.name
    json.description = world_location.description
    json.mapX = world_location.map_x
    json.mapY = world_location.map_y
  end

  json.worldEvents campaign.world_events do |world_event|
    json.id = world_event.id
    json.name = world_event.name
    json.description = world_event.description
    json.when = world_event.when
  end

  json.isDmCampaign campaign.user.id == @current_user&.id
end