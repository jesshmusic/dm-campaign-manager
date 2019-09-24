# frozen_string_literal: true
json.key_format! camelize: :lower

json.id monster.id
json.name monster.name
json.alignment monster.alignment
json.challenge_rating monster.challenge_rating
json.xp monster.xp
json.armorClass monster.armor_class
json.hit_points monster.hit_points
json.initiative monster.initiative
json.speed monster.speed
json.hit_dice monster.hit_dice
json.descriptionText monster.description_text

json.value monster.id
json.label "#{monster.name}: CR #{monster.challenge_rating} - #{monster.xp}xp"
