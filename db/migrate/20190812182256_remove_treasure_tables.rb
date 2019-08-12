# frozen_string_literal: true

class RemoveTreasureTables < ActiveRecord::Migration[5.2]
  def change
    drop_table :treasures
    drop_table :treasure_items
    drop_table :treasure_magic_items
  end
end
