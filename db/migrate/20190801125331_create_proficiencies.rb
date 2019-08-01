class CreateProficiencies < ActiveRecord::Migration[5.2]
  def change
    create_table :proficiencies do |t|
      t.string :name
      t.string :type
      t.string :api_url

      t.timestamps
    end
    
    create_table :proficiency_classes do |t|
      t.belongs_to :proficiency, index: true
      t.belongs_to :dnd_class, index: true
      t.timestamps
    end
  end
end
