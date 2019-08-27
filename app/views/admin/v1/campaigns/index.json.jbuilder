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
    json.id world_location.id
    json.name world_location.name
    json.description world_location.description
    json.mapX world_location.map_x
    json.mapY world_location.map_y
  end

  json.worldEvents campaign.world_events do |world_event|
    json.id world_event.id
    json.name world_event.name
    json.description world_event.description
    json.when world_event.when
  end

  json.adventures campaign.adventures do |adventure|
    json.id adventure.id
    json.name adventure.name
    json.description adventure.description

    json.encounters adventure.encounters do |encounter|
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
          json.id item.id
          json.name item.name
          json.description item.description
          json.cost item.cost_string
          json.type item.type
          json.rarity item.rarity
        end
      end
    end
  end

  json.isDmCampaign campaign.user.id == @current_user&.id
end