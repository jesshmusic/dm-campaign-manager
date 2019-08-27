# frozen_string_literal: true

json.array! @characters, partial: 'admin/v1/characters/character', as: :character
