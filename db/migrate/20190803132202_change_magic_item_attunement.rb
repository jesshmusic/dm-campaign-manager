class ChangeMagicItemAttunement < ActiveRecord::Migration[5.2]
  def change
    change_column :magic_items, :requires_attunement, :string
  end
end
