class CreateMagicItems < ActiveRecord::Migration[5.2]
  def change
    create_table :magic_items do |t|
      t.string :name
      t.string :type
      t.text :description
      t.string :rarity
      t.boolean :requires_attunement

      t.timestamps
    end
  end
end
