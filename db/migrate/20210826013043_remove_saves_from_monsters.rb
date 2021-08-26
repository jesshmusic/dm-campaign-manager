class RemoveSavesFromMonsters < ActiveRecord::Migration[6.1]
  def change
    remove_column :monsters, :charisma_save
    remove_column :monsters, :constitution_save
    remove_column :monsters, :dexterity_save
    remove_column :monsters, :strength_save
    remove_column :monsters, :intelligence_save
    remove_column :monsters, :wisdom_save

    remove_column :monsters, :speed
    remove_column :monsters, :senses
    remove_column :monsters, :condition_immunities

    remove_column :monsters, :hit_dice_modifier
    remove_column :monsters, :hit_dice_number
    remove_column :monsters, :hit_dice_value

    remove_column :monsters, :initiative

    add_column :monsters, :hit_dice, :string

    remove_column :monsters, :damage_immunities
    remove_column :monsters, :damage_resistances
    remove_column :monsters, :damage_vulnerabilities

    add_column :monsters, :damage_immunities, :string, array: true, default: []
    add_column :monsters, :damage_resistances, :string, array: true, default: []
    add_column :monsters, :damage_vulnerabilities, :string, array: true, default: []
  end
end
