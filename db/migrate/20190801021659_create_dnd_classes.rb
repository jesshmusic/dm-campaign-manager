class CreateDndClasses < ActiveRecord::Migration[5.2]
  def change
    create_table :dnd_classes do |t|
      t.text :name
      t.integer :hit_die
      t.string :api_url

      t.timestamps
    end
  end
end
