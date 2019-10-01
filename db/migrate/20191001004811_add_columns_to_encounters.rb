class AddColumnsToEncounters < ActiveRecord::Migration[5.2]
  def change
    add_column :encounters, :round, :integer, default: 1
    add_column :encounters, :current_mob_index, :integer, default: 0
    add_column :encounters, :in_progress, :boolean, default: false
  end
end
