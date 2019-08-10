# frozen_string_literal: true

class ChangeCharacterPlatinumToDefault < ActiveRecord::Migration[5.2]
  def change
    change_column :characters, :platinum_pieces, :integer, default: 0
  end
end
