class AddDefaultValuesToEncounters < ActiveRecord::Migration[5.2]
  def change
    change_column :encounters, :copper_pieces, :integer, default: 0
    change_column :encounters, :silver_pieces, :integer, default: 0
    change_column :encounters, :electrum_pieces, :integer, default: 0
    change_column :encounters, :gold_pieces, :integer, default: 0
    change_column :encounters, :platinum_pieces, :integer, default: 0

    change_column :encounters, :xp, :integer, default: 0
    change_column :encounters, :name, :string, default: 'New Encounter'
  end
end
