# frozen_string_literal: true
json.key_format! camelize: :lower

json.id monster.id
json.name monster.name
json.slug monster.slug
json.challenge_rating monster.challenge_rating
json.monster_type monster.monster_type

json.value monster.id
json.label "#{monster.name}: CR #{monster.challenge_rating} - #{monster.xp}xp"
