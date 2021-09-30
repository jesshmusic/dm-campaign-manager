# frozen_string_literal: true
json.key_format! camelize: :lower

json.extract! dnd_class, :name,
              :slug,
              :hit_die

json.primary_abilities "#{dnd_class.ability_scores.map { |ability| ability.full_name }.join(', ')}"