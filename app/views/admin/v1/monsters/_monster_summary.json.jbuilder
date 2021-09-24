# frozen_string_literal: true
json.key_format! camelize: :lower

json.slug monster.slug
json.alignment monster.alignment.titleize
json.name monster.name
json.slug monster.slug
json.challenge_rating monster.challenge_rating
json.monster_type monster.monster_type.titleize
json.hit_points monster.hit_points
json.hit_dice monster.hit_dice
json.xp_string "(#{number_with_delimiter(monster.xp, delimiter: ',')} xp)"

json.value monster.id
json.label "#{monster.name}: CR #{monster.challenge_rating} - #{monster.xp}xp"
