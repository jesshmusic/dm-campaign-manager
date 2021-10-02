# frozen_string_literal: true
json.key_format! camelize: :lower

json.extract! monster, :name,
              :slug,
              :alignment,
              :armor_class

json.challenge monster.challenge_string
json.hit_points monster.hit_points_string
json.value monster.id
json.label "#{monster.name}: CR #{monster.challenge_rating} - #{monster.xp}xp"
