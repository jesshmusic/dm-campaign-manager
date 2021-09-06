class CreateDndClassItemOptionChoices < ActiveRecord::Migration[6.1]
  def change
    create_table :dnd_class_item_option_choices do |t|
      t.references :dnd_class_item_option, null: false, foreign_key: true
      t.integer :quantity

      t.timestamps
    end
  end
end
