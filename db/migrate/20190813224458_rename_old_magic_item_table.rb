# frozen_string_literal: true

class RenameOldMagicItemTable < ActiveRecord::Migration[5.2]
  def change
    rename_table :magic_items, :magic_items_old
  end
end
