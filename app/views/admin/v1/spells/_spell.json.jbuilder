# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! spell, :id, :name, :higher_level, :page,
              :range, :components, :material, :ritual, :duration,
              :concentration, :casting_time, :level

json.description_text spell.description_text

json.url spell_url(spell, format: :json)
