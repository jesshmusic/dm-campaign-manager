# frozen_string_literal: true
json.key_format! camelize: :lower

json.extract! monster, :name,
              :slug,
              :alignment,
              :armor_class,
              :monster_type,
              :challenge_rating,
              :user_id

json.hit_points monster.hit_points_string
json.value monster.id
json.label "#{monster.name}: CR #{monster.challenge_rating} - #{monster.xp}xp"
