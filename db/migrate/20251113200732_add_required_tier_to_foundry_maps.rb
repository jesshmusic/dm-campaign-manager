class AddRequiredTierToFoundryMaps < ActiveRecord::Migration[6.1]
  def change
    add_column :foundry_maps, :required_tier, :string, default: 'free'
  end
end
