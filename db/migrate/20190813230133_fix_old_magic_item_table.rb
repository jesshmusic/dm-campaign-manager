# frozen_string_literal: true

class FixOldMagicItemTable < ActiveRecord::Migration[5.2]
  def change
    rename_table :magic_items_old, :magic_item_olds
  end
end
