# frozen_string_literal: true

json.id encounter.id
json.name encounter.name
json.description encounter.description
json.copperPieces encounter.copper_pieces
json.silverPieces encounter.silver_pieces
json.electrumPieces encounter.electrum_pieces
json.goldPieces encounter.gold_pieces
json.xp encounter.xp

json.encounterMonsters encounter.encounter_monsters do |encounter_monster|
  json.id encounter_monster.id
  json.numberOfMonsters encounter_monster.number_of_monsters
  json.monster do
    json.id encounter_monster.monster.id
    json.name encounter_monster.monster.name
    json.alignment encounter_monster.monster.alignment
    json.challengeRating encounter_monster.monster.challenge_rating
    json.armorClass encounter_monster.monster.stat_block.armor_class
    json.hitPoints encounter_monster.monster.stat_block.hit_points
    json.initiative encounter_monster.monster.stat_block.initiative
    json.speed encounter_monster.monster.stat_block.speed
    json.hitDice encounter_monster.monster.hit_dice
  end
end

json.equipment_items encounter.equipment_items do |equipment_item|
  json.id equipment_item.id
  json.quantity equipment_item.quantity

  json.items equipment_item.items do |item|
    json.partial! 'admin/v1/items/item', item: item
  end
end
