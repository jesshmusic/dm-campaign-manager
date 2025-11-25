# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! proficiency, :id
json.name proficiency.name.delete_prefix('Saving Throw: ')
