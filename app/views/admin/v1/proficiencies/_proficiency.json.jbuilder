# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! proficiency, :slug, :name, :prof_type
