# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! campaign, :id, :name, :description, :world, :slug
json.pcs_count campaign.pcs_count
json.npcs_count campaign.npcs_count

json.pcs campaign.pcs do |pc|
  json.partial! 'admin/v1/characters/character', character: pc
end

json.npcs campaign.npcs do |npc|
  json.partial! 'admin/v1/characters/character', character: npc
end

json.dungeon_master do
  json.id campaign.user.id
  json.name campaign.user.name
  json.username campaign.user.username
  json.role campaign.user.role
  json.location campaign.user.location
end

json.world_locations campaign.world_locations do |world_location|
  json.partial! 'admin/v1/campaigns/world_location', world_location: world_location
end

json.worldEvents campaign.world_events do |world_event|
  json.partial! 'admin/v1/campaigns/world_event', world_event: world_event
end

json.adventures campaign.adventures do |adventure|
  json.partial! 'admin/v1/adventures/adventure', adventure: adventure, campaign: campaign
end

json.isDmCampaign campaign.user.id == @current_user&.id

json.url v1_campaign_url(campaign, format: :json)
