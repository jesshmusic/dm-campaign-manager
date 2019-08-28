# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! spell, :id, :name, :higher_level, :page,
              :range, :components, :material, :ritual, :duration,
              :concentration, :casting_time, :level, :school

json.description_text spell.description_text
json.spell_classes spell.spell_classes
json.spell_level spell.spell_level

json.url v1_spell_url(spell, format: :json)
