class CreateStartingEquipmentChoices < ActiveRecord::Migration[6.1]
  def change
    create_table :starting_equipment_choices do |t|
      t.integer :choose
      t.string :type

      t.timestamps
    end

    add_reference :starting_equipment_options, :starting_equipment_choices, index: {name: :starting_equip_index}
  end
end
