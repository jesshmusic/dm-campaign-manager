# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! encounter, :id, :name, :copper_pieces, :silver_pieces, :electrum_pieces, :gold_pieces, :xp

json.encounterMonsters encounter.encounter_monsters do |encounter_monster|
  json.id encounter_monster.id
  json.numberOfMonsters encounter_monster.number_of_monsters
  json.monsterId encounter_monster.monster_id
  json.monster do
    json.partial! 'admin/v1/monsters/monster_summary', monster: encounter_monster.monster
  end
end

json.equipment_items encounter.equipment_items do |equipment_item|
  json.id equipment_item.id
  json.quantity equipment_item.quantity

  json.items equipment_item.items do |item|
    json.partial! 'admin/v1/items/item_summary', item: item
  end
end

json.url v1_campaign_adventure_encounter_url(campaign, adventure, encounter, format: :json)
