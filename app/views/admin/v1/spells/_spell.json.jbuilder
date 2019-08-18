# frozen_string_literal: true

json.extract! spell, :id, :name, :description, :higher_level, :page, :range, :components, :material, :ritual, :duration, :concentration, :casting_time, :level, :created_at, :updated_at
json.url spell_url(spell, format: :json)
