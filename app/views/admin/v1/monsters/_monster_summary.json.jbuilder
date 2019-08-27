# frozen_string_literal: true
json.key_format! camelize: :lower

json.id monster.id
json.name monster.name
json.alignment monster.alignment
json.challenge_rating monster.challenge_rating
json.armorClass monster.stat_block.armor_class
json.hit_points monster.stat_block.hit_points
json.initiative monster.stat_block.initiative
json.speed monster.stat_block.speed
json.hit_dice monster.stat_block.hit_dice
json.descriptionText monster.description_text

json.url v1_monster_url(monster, format: :json)
