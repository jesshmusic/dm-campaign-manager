# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! adventure, :id, :name, :description

json.world_location do
  if adventure.adventure_world_location
    json.value adventure.adventure_world_location.world_location.id
    json.label adventure.adventure_world_location.world_location.name
    json.data do
      json.adventure_location_id adventure.adventure_world_location.id
    end
  end
end

json.pcs adventure.pcs do |pc|
  json.partial! 'admin/v1/characters/character_summary', character: pc
end

json.npcs adventure.npcs do |npc|
  json.partial! 'admin/v1/characters/character_summary', character: npc
end

json.encounters adventure.encounters do |encounter|
  json.partial! 'admin/v1/encounters/encounter', encounter: encounter, adventure: adventure, campaign: campaign
end
