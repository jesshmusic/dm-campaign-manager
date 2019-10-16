# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! campaign, :id, :name, :description, :world, :slug
json.excerpt strip_tags(campaign.description).truncate_words(25, omission: '...')
json.pcs_count campaign.pcs_count
json.npcs_count campaign.npcs_count

json.dungeon_master do
  json.id campaign.dungeon_master.id
  json.name campaign.dungeon_master.name
  json.username campaign.dungeon_master.username
  json.location campaign.dungeon_master.location
  json.info campaign.dungeon_master.info
  json.url user_url(campaign.dungeon_master)
end

json.pcs campaign.pcs do |pc|
  json.partial! 'admin/v1/characters/character_summary', character: pc
end

json.npcs campaign.npcs do |npc|
  json.partial! 'admin/v1/characters/character_summary', character: npc
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

json.adventures campaign.adventures.order(sort: :asc) do |adventure|
  json.partial! 'admin/v1/adventures/adventure', adventure: adventure, campaign: campaign
end

json.guilds campaign.guilds do |guild|
  json.partial! 'admin/v1/guilds/guild', guild: guild
end

json.isDmCampaign campaign.user.id == @current_user&.id

json.url v1_campaign_url(campaign, format: :json)
