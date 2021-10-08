class CreateSections < ActiveRecord::Migration[6.1]
  def change
    create_table :sections do |t|
      t.string :name
      t.string :description
      t.string :slug

      t.timestamps
    end
  end
end
