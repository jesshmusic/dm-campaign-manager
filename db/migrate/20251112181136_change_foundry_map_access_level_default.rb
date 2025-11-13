class ChangeFoundryMapAccessLevelDefault < ActiveRecord::Migration[6.1]
  def up
    change_column_default :foundry_maps, :access_level, from: 'free', to: 'premium'
  end

  def down
    change_column_default :foundry_maps, :access_level, from: 'premium', to: 'free'
  end
end
