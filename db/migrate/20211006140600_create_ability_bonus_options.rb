class CreateAbilityBonusOptions < ActiveRecord::Migration[6.1]
  def change
    create_table :ability_bonus_options do |t|
      t.string :ability
      t.integer :bonus
      t.references :race, null: false, foreign_key: true

      t.timestamps
    end

    Race.all.each do |race|
      race.ability_bonus_options.create(ability: 'Charisma', bonus: race.charisma_modifier) if race.charisma_modifier > 0
      race.ability_bonus_options.create(ability: 'Constitution', bonus: race.constitution_modifier) if race.constitution_modifier > 0
      race.ability_bonus_options.create(ability: 'Dexterity', bonus: race.dexterity_modifier) if race.dexterity_modifier > 0
      race.ability_bonus_options.create(ability: 'Intelligence', bonus: race.intelligence_modifier) if race.intelligence_modifier > 0
      race.ability_bonus_options.create(ability: 'Strength', bonus: race.strength_modifier) if race.strength_modifier > 0
      race.ability_bonus_options.create(ability: 'Wisdom', bonus: race.wisdom_modifier) if race.wisdom_modifier > 0
    end

    remove_column :races, :charisma_modifier
    remove_column :races, :constitution_modifier
    remove_column :races, :dexterity_modifier
    remove_column :races, :intelligence_modifier
    remove_column :races, :strength_modifier
    remove_column :races, :wisdom_modifier
  end
end
