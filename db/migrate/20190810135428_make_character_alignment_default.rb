# frozen_string_literal: true

class MakeCharacterAlignmentDefault < ActiveRecord::Migration[5.2]
  def change
    change_column :characters, :alignment, :string, default: 'neutral'
  end
end
