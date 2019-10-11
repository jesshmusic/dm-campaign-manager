# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! spell, :id, :name, :higher_level, :page,
              :range, :components, :material, :ritual, :duration, :slug,
              :concentration, :casting_time, :level, :school, :user_id

json.excerpt strip_tags(spell.description).truncate_words(20, omission: '...')

json.description_text spell.description_text
json.spell_classes spell.spell_classes
json.spell_level spell.spell_level
