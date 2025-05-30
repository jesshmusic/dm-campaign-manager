# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! spell, :id, :name, :higher_level, :page, :description,
              :range, :components, :material, :ritual, :duration, :slug,
              :concentration, :casting_time, :level, :school, :user_id

json.excerpt strip_tags(spell.description).truncate_words(20, omission: '...') unless spell.description.nil?

json.spell_classes spell.spell_classes
json.spell_level spell.spell_level
