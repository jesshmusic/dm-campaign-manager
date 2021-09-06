class CreateDndClassItemOptionItems < ActiveRecord::Migration[6.1]
  def change
    create_table :dnd_class_item_option_items do |t|
      t.references :dnd_class_item_option_choice, null: false, foreign_key: true, index: { name: :dnd_class_equip_option}
      t.references :item, null: false, foreign_key: true

      t.timestamps
    end
  end
end
