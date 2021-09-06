class AddDndClassToEquipment < ActiveRecord::Migration[6.1]
  def change
    add_reference :equipment, :dnd_class, null: false, foreign_key: true
  end
end
