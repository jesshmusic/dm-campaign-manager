json.extract! guild, :id, :name, :description, :campaign_id, :slug

json.pcs guild.pcs do |pc|
  json.partial! 'admin/v1/characters/character_summary', character: pc
end

json.npcs guild.pcs do |npc|
  json.partial! 'admin/v1/characters/character_summary', character: npc
end
