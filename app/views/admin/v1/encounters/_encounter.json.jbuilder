# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! encounter,
              :id,
              :name,
              :description,
              :location,
              :copper_pieces,
              :silver_pieces,
              :electrum_pieces,
              :gold_pieces,
              :platinum_pieces,
              :sort,
              :xp

json.encounter_state do
  json.in_progress encounter.in_progress
  json.round encounter.round
  json.current_combatant encounter.current_mob_index
end

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

json.npcs encounter.npcs do |npc|
  json.partial! 'admin/v1/characters/character_summary', character: npc
end

json.npc_options encounter.npc_options do |npc_option|
  json.value npc_option.id
  json.label "#{npc_option.name} -- #{npc_option.classes}"
end

json.combatants encounter.encounter_combatants do |encounter_combatant|
  json.id encounter_combatant.id
  json.combat_order_number encounter_combatant.combat_order_number
  json.current_hit_points encounter_combatant.current_hit_points
  json.initiative_roll encounter_combatant.initiative_roll
  json.note encounter_combatant.notes
  json.combatant do
    json.partial! 'admin/v1/monsters/monster_summary', monster: encounter_combatant.monster unless encounter_combatant.monster.nil?
    json.partial! 'admin/v1/characters/character_summary', character: encounter_combatant.character unless encounter_combatant.character.nil?
  end
end

json.next_encounter_id encounter.next_encounter_id
json.prev_encounter_id encounter.prev_encounter_id
