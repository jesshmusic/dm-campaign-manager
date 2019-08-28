class AddFieldsToCharacterClasses < ActiveRecord::Migration[5.2]
  def up
    add_column :dnd_classes,
               :spell_ability,
               :string
    add_column :dnd_classes,
               :primary_abilities,
               :string,
               default: [],
               array: true
    add_column :dnd_classes,
               :saving_throw_abilities,
               :string,
               default: [],
               array: true

    DndClass.all.each do |dnd_class|
      case dnd_class.name
      when 'Barbarian'
        dnd_class.primary_abilities << 'Strength'
        dnd_class.saving_throw_abilities << 'Strength'
        dnd_class.saving_throw_abilities << 'Constitution'
      when 'Bard'
        dnd_class.primary_abilities << 'Charisma'
        dnd_class.saving_throw_abilities << 'Dexterity'
        dnd_class.saving_throw_abilities << 'Charisma'
        dnd_class.spell_ability = 'Charisma'
      when 'Cleric'
        dnd_class.primary_abilities << 'Wisdom'
        dnd_class.saving_throw_abilities << 'Wisdom'
        dnd_class.saving_throw_abilities << 'Charisma'
        dnd_class.spell_ability = 'Wisdom'
      when 'Druid'
        dnd_class.primary_abilities << 'Wisdom'
        dnd_class.saving_throw_abilities << 'Intelligence'
        dnd_class.saving_throw_abilities << 'Wisdom'
        dnd_class.spell_ability = 'Wisdom'
      when 'Fighter'
        dnd_class.primary_abilities << 'Strength'
        dnd_class.saving_throw_abilities << 'Strength'
        dnd_class.saving_throw_abilities << 'Constitution'
      when 'Monk'
        dnd_class.primary_abilities << 'Dexterity'
        dnd_class.primary_abilities << 'Wisdom'
        dnd_class.saving_throw_abilities << 'Strength'
        dnd_class.saving_throw_abilities << 'Dexterity'
      when 'Paladin'
        dnd_class.primary_abilities << 'Strength'
        dnd_class.primary_abilities << 'Charisma'
        dnd_class.saving_throw_abilities << 'Wisdom'
        dnd_class.saving_throw_abilities << 'Charisma'
        dnd_class.spell_ability = 'Charisma'
      when 'Ranger'
        dnd_class.primary_abilities << 'Dexterity'
        dnd_class.primary_abilities << 'Wisdom'
        dnd_class.saving_throw_abilities << 'Strength'
        dnd_class.saving_throw_abilities << 'Dexterity'
        dnd_class.spell_ability = 'Wisdom'
      when 'Rogue'
        dnd_class.primary_abilities << 'Dexterity'
        dnd_class.saving_throw_abilities << 'Dexterity'
        dnd_class.saving_throw_abilities << 'Intelligence'
      when 'Sorcerer'
        dnd_class.primary_abilities << 'Charisma'
        dnd_class.saving_throw_abilities << 'Constitution'
        dnd_class.saving_throw_abilities << 'Charisma'
        dnd_class.spell_ability = 'Charisma'
      when 'Warlock'
        dnd_class.primary_abilities << 'Charisma'
        dnd_class.saving_throw_abilities << 'Wisdom'
        dnd_class.saving_throw_abilities << 'Charisma'
        dnd_class.spell_ability = 'Charisma'
      when 'Wizard'
        dnd_class.primary_abilities << 'Intelligence'
        dnd_class.saving_throw_abilities << 'Intelligence'
        dnd_class.saving_throw_abilities << 'Wisdom'
        dnd_class.spell_ability = 'Intelligence'
      end
      dnd_class.save!
    end

    add_column :character_classes,
               :level,
               :integer,
               default: 1
    add_column :character_classes,
               :proficiency_bonus,
               :integer,
               default: 2
    add_column :character_classes,
               :spell_attack_bonus,
               :integer,
               default: 2
    add_column :character_classes,
               :spell_save_dc,
               :integer,
               default: 8

    Character.all.each do |char|
      char.character_classes.each do |char_class|
        char_class.level = char.level
        char_class.proficiency_bonus = DndRules.proficiency_bonus_for_level(char.level)
        char_class.spell_attack_bonus = char.spell_attack_bonus
        char_class.spell_save_dc = char.spell_save_dc
        char_class.save!
      end
      char.save!
    end

    remove_column :characters, :level
    remove_column :characters, :spell_ability
    remove_column :characters, :spell_attack_bonus
    remove_column :characters, :spell_save_dc
  end

  def down
    add_column :characters, :level, :integer
    add_column :characters, :spell_ability, :string
    add_column :characters, :spell_attack_bonus, :integer
    add_column :characters, :spell_save_dc, :integer

    Character.all.each do |char|
      char.level = char.character_classes.first.level
      char.spell_ability = char.character_classes.first.dnd_class.spell_ability
      char.spell_attack_bonus = char.character_classes.first.spell_attack_bonus
      char.spell_save_dc = char.character_classes.first.spell_save_dc
      char.save!
    end

    remove_column :character_classes, :level
    remove_column :character_classes, :spell_ability
    remove_column :character_classes, :spell_attack_bonus
    remove_column :character_classes, :spell_save_dc
    remove_column :dnd_classes, :spell_ability
    remove_column :dnd_classes, :primary_abilities
    remove_column :dnd_classes, :saving_throw_abilities
  end
end
