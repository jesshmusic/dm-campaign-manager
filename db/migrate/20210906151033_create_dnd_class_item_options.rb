class CreateDndClassItemOptions < ActiveRecord::Migration[6.1]
  def change
    create_table :dnd_class_item_options do |t|
      t.integer :choose
      t.string :type
      t.references :dnd_class, null: false, foreign_key: true

      t.timestamps
    end
  end
end
