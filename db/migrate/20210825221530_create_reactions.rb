class CreateReactions < ActiveRecord::Migration[6.1]
  def change
    remove_column :monsters, :reactions

    create_table :reactions do |t|
      t.string :name
      t.string :desc
      t.references :monster, foreign_key: true

      t.timestamps
    end
  end
end
