class DropDndClassItemTables < ActiveRecord::Migration[6.1]
  def change
    drop_table :dnd_class_items
    remove_foreign_key "dnd_class_item_option_choices", "dnd_class_item_options"
    remove_foreign_key "dnd_class_item_option_items", "dnd_class_item_option_choices"
    remove_foreign_key "dnd_class_item_option_items", "items"
    remove_foreign_key "dnd_class_item_options", "dnd_classes"
    # remove_foreign_key "dnd_class_items", "dnd_classes"
    # remove_foreign_key "dnd_class_items", "items"
    drop_table :dnd_class_item_options
    drop_table :dnd_class_item_option_items
    drop_table :dnd_class_item_option_choices
  end
end
