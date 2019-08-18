# frozen_string_literal: true

json.extract! dnd_class, :id, :name, :hit_die, :api_url, :proficiencies, :saving_throws, :proficiency_choices, :created_at, :updated_at
json.url dnd_class_url(dnd_class, format: :json)
