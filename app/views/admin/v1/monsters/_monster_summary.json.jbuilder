# frozen_string_literal: true
json.key_format! camelize: :lower

json.extract! monster, :name,
              :slug,
              :monster_type,
              :monster_subtype,
              :size,
              :challenge_rating,
              :xp,
              :hit_dice,
              :hit_points,
              :alignment,
              :armor_class,
              :attack_bonus,
              :prof_bonus,
              :save_dc

json.value monster.id
json.label "#{monster.name}: CR #{monster.challenge_rating} - #{monster.xp}xp"
