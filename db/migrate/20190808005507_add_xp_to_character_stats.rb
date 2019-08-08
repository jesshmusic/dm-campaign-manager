class AddXpToCharacterStats < ActiveRecord::Migration[5.2]
  def change
    add_column :character_stats, :xp, :integer
  end
end
