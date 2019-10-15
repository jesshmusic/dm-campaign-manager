class RemoveGuildsFkFromCharacters < ActiveRecord::Migration[5.2]
  def change
    if foreign_key_exists?(:characters, :guilds)
      remove_foreign_key :characters, :guilds
    end
  end
end
