class AddStatsToCharactersAndMonsters < ActiveRecord::Migration[5.2]
  def change
    add_column :characters, :armor_class, :integer, default: 10, null: false
    add_column :characters, :charisma, :integer, default: 10, null: false
    add_column :characters, :constitution, :integer, default: 10, null: false
    add_column :characters, :dexterity, :integer, default: 10, null: false
    add_column :characters, :hit_points, :integer, default: 8, null: false
    add_column :characters, :hit_points_current, :integer, default: 8, null: false
    add_column :characters, :initiative, :integer, default: 0, null: false
    add_column :characters, :intelligence, :integer, default: 10, null: false
    add_column :characters, :speed, :string, default: "30 feet", null: false
    add_column :characters, :strength, :integer, default: 10, null: false
    add_column :characters, :wisdom, :integer, default: 10, null: false

    Character.all.each do |character|
      stats = character.stat_block
      character.update_attributes(
                 armor_class: stats.armor_class,
                 charisma: stats.charisma,
                 constitution: stats.constitution,
                 dexterity: stats.dexterity,
                 hit_points: stats.hit_points,
                 hit_points_current: stats.hit_points_current,
                 initiative: stats.initiative,
                 intelligence: stats.intelligence,
                 speed: stats.speed,
                 strength: stats.strength,
                 wisdom: stats.wisdom)
    end

    add_column :monsters, :armor_class, :integer, default: 10
    add_column :monsters, :charisma, :integer, default: 10, null: false
    add_column :monsters, :constitution, :integer, default: 10, null: false
    add_column :monsters, :dexterity, :integer, default: 10, null: false
    add_column :monsters, :hit_dice_modifier, :integer, default: 0
    add_column :monsters, :hit_dice_number, :integer, default: 1, null: false
    add_column :monsters, :hit_dice_value, :integer, default: 8, null: false
    add_column :monsters, :hit_points, :integer, default: 8, null: false
    add_column :monsters, :initiative, :integer, default: 0, null: false
    add_column :monsters, :intelligence, :integer, default: 10, null: false
    add_column :monsters, :speed, :string, default: "30 feet", null: false
    add_column :monsters, :strength, :integer, default: 10, null: false
    add_column :monsters, :wisdom, :integer, default: 10, null: false

    Monster.all.each do |monster|
      stats = monster.stat_block
      monster.update_attributes(
        armor_class: stats.armor_class,
        charisma: stats.charisma,
        constitution: stats.constitution,
        dexterity: stats.dexterity,
        hit_dice_modifier: stats.hit_dice_modifier,
        hit_dice_number: stats.hit_dice_number,
        hit_dice_value: stats.hit_dice_value,
        hit_points: stats.hit_points,
        initiative: stats.initiative,
        intelligence: stats.intelligence,
        speed: stats.speed,
        strength: stats.strength,
        wisdom: stats.wisdom)
    end
  end
end
