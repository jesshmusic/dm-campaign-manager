class AddSlugIndexToGuilds < ActiveRecord::Migration[5.2]
  def change
    add_index :guilds, :slug
  end
end
