class CreateSpellsAndClasses < ActiveRecord::Migration[5.2]
  def change
    create_table :spell_classes do |t|
      t.belongs_to :spell, index: true
      t.belongs_to :dnd_class, index: true
      t.timestamps
    end
  end
end
