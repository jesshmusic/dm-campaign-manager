class CreateDndClassItems < ActiveRecord::Migration[6.1]
  def change
    create_table :dnd_class_items do |t|
      t.references :dnd_class, null: false, foreign_key: true
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
