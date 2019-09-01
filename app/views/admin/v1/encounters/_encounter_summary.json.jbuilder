# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! encounter, :id, :name, :location, :xp

json.encounterMonsters encounter.encounter_monsters do |encounter_monster|
  json.id encounter_monster.id
  json.number_of_monsters encounter_monster.number_of_monsters
  json.monster_id encounter_monster.monster_id
  json.partial! 'admin/v1/monsters/monster_summary', monster: encounter_monster.monster
end

json.treasure encounter.encounter_items do |encounter_item|
  json.id encounter_item.id
  json.quantity encounter_item.quantity
  json.partial! 'admin/v1/items/item_summary', item: encounter_item.item
end

json.url v1_campaign_adventure_encounter_url(campaign, adventure, encounter, format: :json)
