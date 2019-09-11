class AddArmorIdToCharacters < ActiveRecord::Migration[5.2]
  def change
    add_column :characters, :armor_id, :integer
    add_column :characters, :shield_id, :integer
    add_column :characters, :weapon_lh_id, :integer
    add_column :characters, :weapon_rh_id, :integer
    add_column :characters, :weapon_2h_id, :integer
  end
end
