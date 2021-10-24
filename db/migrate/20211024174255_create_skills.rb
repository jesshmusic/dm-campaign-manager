class CreateSkills < ActiveRecord::Migration[6.1]
  def change
    create_table :skills do |t|
      t.string :slug
      t.string :name
      t.string :desc
      t.string :ability_score

      t.timestamps
    end
  end
end
