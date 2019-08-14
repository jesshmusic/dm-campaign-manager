# frozen_string_literal: true

class RemoveOldMagicItems < ActiveRecord::Migration[5.2]
  def change
    drop_table :character_magic_items
    drop_table :magic_item_olds

    remove_column :items, :category
  end
end
