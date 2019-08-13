# frozen_string_literal: true

class RemoveCharacterTypeFromCharacter < ActiveRecord::Migration[5.2]
  def change
    remove_column :characters, :character_type, :string
  end
end
