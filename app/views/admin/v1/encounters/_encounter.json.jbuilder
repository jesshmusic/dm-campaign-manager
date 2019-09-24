# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! encounter,
              :id,
              :name,
              :description,
              :copper_pieces,
              :silver_pieces,
              :electrum_pieces,
              :gold_pieces,
              :platinum_pieces,
              :xp

json.encounter_monsters encounter.encounter_monsters do |encounter_monster|
  json.id encounter_monster.id
  json.numberOfMonsters encounter_monster.number_of_monsters
  json.monster do
    json.partial! 'admin/v1/monsters/monster_summary', monster: encounter_monster.monster
  end
end

json.encounter_items encounter.encounter_items do |encounter_item|
  json.id encounter_item.id
  json.quantity encounter_item.quantity

  json.item do
    json.value encounter_item.item.id
    json.label encounter_item.item.name

    json.name encounter_item.item.name
    json.type encounter_item.item.type
    json.cost "#{encounter_item.item.cost_value}#{encounter_item.item.cost_unit}"
    json.description encounter_item.item.description
    json.sub_category encounter_item.item.sub_category
    json.rarity encounter_item.item.rarity
    json.weight encounter_item.item.weight
  end
end

json.url v1_campaign_adventure_encounter_url(campaign, adventure, encounter, format: :json)
