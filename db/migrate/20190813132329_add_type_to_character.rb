# frozen_string_literal: true

class AddTypeToCharacter < ActiveRecord::Migration[5.2]
  def change
    add_column :characters, :type, :string
  end
end
