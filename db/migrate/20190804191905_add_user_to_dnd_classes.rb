class AddUserToDndClasses < ActiveRecord::Migration[5.2]
  def change
    add_reference :dnd_classes, :user, foreign_key: true
    add_reference :items, :user, foreign_key: true
    add_reference :magic_items, :user, foreign_key: true
    add_reference :monsters, :user, foreign_key: true
    add_reference :spells, :user, foreign_key: true
    
    add_column :campaigns, :slug, :string
    add_index :campaigns, :slug, unique: true
    
    add_column :dnd_classes, :slug, :string
    add_index :dnd_classes, :slug, unique: true
    
    add_column :items, :slug, :string
    add_index :items, :slug, unique: true
    
    add_column :magic_items, :slug, :string
    add_index :magic_items, :slug, unique: true
    
    add_column :monsters, :slug, :string
    add_index :monsters, :slug, unique: true
    
    add_column :spells, :slug, :string
    add_index :spells, :slug, unique: true
    
    add_column :users, :slug, :string
    add_index :users, :slug, unique: true
  end
end
