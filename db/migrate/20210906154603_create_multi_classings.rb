class CreateMultiClassings < ActiveRecord::Migration[6.1]
  def change
    create_table :multi_classings do |t|
      t.references :dnd_class, null: false, foreign_key: true

      t.timestamps
    end
  end
end
