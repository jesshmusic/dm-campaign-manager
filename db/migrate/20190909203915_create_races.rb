class CreateRaces < ActiveRecord::Migration[5.2]
  def change
    create_table :races do |t|
      t.string :name, default: 'New Race...', null: false, index: true
      t.string :speed, default: '30 feet', null: false
      t.integer :strength_modifier, default: 0, null: false
      t.integer :dexterity_modifier, default: 0, null: false
      t.integer :constitution_modifier, default: 0, null: false
      t.integer :intelligence_modifier, default: 0, null: false
      t.integer :wisdom_modifier, default: 0, null: false
      t.integer :charisma_modifier, default: 0, null: false
      t.string :slug, null: false, index: true

      t.timestamps
    end
  end
end
