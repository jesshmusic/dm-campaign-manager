# frozen_string_literal: true

json.key_format! camelize: :lower

json.extract! condition, :slug, :name, :id
