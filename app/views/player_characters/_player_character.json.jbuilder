json.extract! player_character, :id, :name, :description, :slug, :created_at, :updated_at
json.url player_character_url(player_character, format: :json)
