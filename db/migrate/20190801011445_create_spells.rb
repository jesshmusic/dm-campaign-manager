class CreateSpells < ActiveRecord::Migration[5.2]
  def change
    create_table :spells do |t|
      t.text :name
      t.text :description
      t.text :higher_level
      t.text :page
      t.text :range
      t.text :components, array:true, default: []
      t.text :material
      t.boolean :ritual
      t.text :duration
      t.boolean :concentration
      t.string :casting_time
      t.integer :level

      t.timestamps
    end
  end
end
