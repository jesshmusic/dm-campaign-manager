class CreateCharacterClasses < ActiveRecord::Migration[5.2]
  def change
    create_table :character_classes do |t|
      t.belongs_to :character, foreign_key: true
      t.belongs_to :dnd_class, foreign_key: true

      t.timestamps
    end
  end
end
