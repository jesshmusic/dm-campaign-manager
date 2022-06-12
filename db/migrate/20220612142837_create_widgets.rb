class CreateWidgets < ActiveRecord::Migration[6.1]
  def change
    create_table :widgets do |t|
      t.text :title
      t.text :subtitle
      t.text :content
      t.text :icon

      t.timestamps
    end
  end
end
