# frozen_string_literal: true

class SpellSlots
  class << self
    def spell_slots(character_class)
      character_level = character_class.level < 21 ? character_class.level : 20
      case character_class.dnd_class.name
      when 'Bard'
        bard(character_level)
      when 'Cleric'
        cleric(character_level)
      when 'Druid'
        druid(character_level)
      when 'Paladin'
        paladin(character_level)
      when 'Ranger'
        ranger(character_level)
      when 'Sorcerer'
        sorcerer(character_level)
      when 'Warlock'
        warlock(character_level)
      when 'Wizard'
        wizard(character_level)
      else
        nil
      end
    end

    def random_spell(dnd_class, spell_level, excluded_spells = [])
      spells = Spell.joins(:dnd_classes).where(
        dnd_classes: {
          name: dnd_class
        },
        level: spell_level
      ) - excluded_spells
      spells.sample
    end

    def spell_ability(character)
      case character.dnd_class_string
      when 'Bard'
        { ability: 'Charisma', mod: DndRules.ability_score_modifier(character.stat_block.charisma) }
      when 'Cleric'
        { ability: 'Wisdom', mod: DndRules.ability_score_modifier(character.stat_block.wisdom) }
      when 'Druid'
        { ability: 'Wisdom', mod: DndRules.ability_score_modifier(character.stat_block.wisdom) }
      when 'Paladin'
        { ability: 'Charisma', mod: DndRules.ability_score_modifier(character.stat_block.charisma) }
      when 'Ranger'
        { ability: 'Wisdom', mod: DndRules.ability_score_modifier(character.stat_block.wisdom) }
      when 'Sorcerer'
        { ability: 'Charisma', mod: DndRules.ability_score_modifier(character.stat_block.charisma) }
      when 'Warlock'
        { ability: 'Charisma', mod: DndRules.ability_score_modifier(character.stat_block.charisma) }
      when 'Wizard'
        { ability: 'Intelligence', mod: DndRules.ability_score_modifier(character.stat_block.intelligence) }
      else
        { ability: 'Intelligence', mod: DndRules.ability_score_modifier(character.stat_block.intelligence) }
      end
    end

    private

    def bard(level)
      file = File.read('app/assets/data/spell_slots_bard.json')
      spell_slots = JSON.parse file
      spell_slots["level_#{level}"].each_with_object({}) { |(k, v), memo| memo[k.to_sym] = v; }
    end

    def cleric(level)
      file = File.read('app/assets/data/spell_slots_cleric.json')
      spell_slots = JSON.parse file
      spell_slots["level_#{level}"].each_with_object({}) { |(k, v), memo| memo[k.to_sym] = v; }
    end

    def druid(level)
      file = File.read('app/assets/data/spell_slots_druid.json')
      spell_slots = JSON.parse file
      spell_slots["level_#{level}"].each_with_object({}) { |(k, v), memo| memo[k.to_sym] = v; }
    end

    def paladin(level)
      file = File.read('app/assets/data/spell_slots_paladin.json')
      spell_slots = JSON.parse file
      spell_slots["level_#{level}"].each_with_object({}) { |(k, v), memo| memo[k.to_sym] = v; }
    end

    def ranger(level)
      file = File.read('app/assets/data/spell_slots_ranger.json')
      spell_slots = JSON.parse file
      spell_slots["level_#{level}"].each_with_object({}) { |(k, v), memo| memo[k.to_sym] = v; }
    end

    def sorcerer(level)
      file = File.read('app/assets/data/spell_slots_sorcerer.json')
      spell_slots = JSON.parse file
      spell_slots["level_#{level}"].each_with_object({}) { |(k, v), memo| memo[k.to_sym] = v; }
    end

    def warlock(level)
      file = File.read('app/assets/data/spell_slots_warlock.json')
      spell_slots = JSON.parse file
      spell_slots["level_#{level}"].each_with_object({}) { |(k, v), memo| memo[k.to_sym] = v; }
    end

    def wizard(level)
      file = File.read('app/assets/data/spell_slots_wizard.json')
      spell_slots = JSON.parse file
      spell_slots["level_#{level}"].each_with_object({}) { |(k, v), memo| memo[k.to_sym] = v; }
    end
  end
end
