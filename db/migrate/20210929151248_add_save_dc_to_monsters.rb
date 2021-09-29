class AddSaveDcToMonsters < ActiveRecord::Migration[6.1]
  def change
    add_column :monsters, :save_dc, :integer, default: 13
    add_column :monsters, :prof_bonus, :integer, default: 2
    remove_column :monsters, :legendary_description
    rename_column :actions, :success_type, :dc_success_type
    rename_column :actions, :dc_type, :dc_ability
  end
end
