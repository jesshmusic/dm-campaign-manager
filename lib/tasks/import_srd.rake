# frozen_string_literal: true

# Imports from SRD APIs
# Order:
# - `rails srd:import_classes`
# - `rails srd:import_proficiencies`
# - `rails srd:set_prof_choices_for_class`
# - `rails srd:import_monsters`
# - `rails srd:import_spells`
# - `rails srd:import_magic_items`
# - `rails srd:fix_combined_magic_items`
# - `rails srd:import_items`

namespace :srd do
  task import_all: :environment do
    ImportSrdUtilities.import_all
  end

  task clean_all: :environment do
    ImportSrdUtilities.clean_database
  end

  task import_dependencies: :environment do
    ImportSrdUtilities.import_dependencies
  end

  task import_dnd_classes: :environment do
    ImportSrdUtilities.import_dependencies
    DndClassesUtil.import
  end

  task import_items: :environment do
    Item.destroy_all
    ItemsUtil.import
    MagicItemsUtil.import
  end

  task import_magic_items: :environment do
    MagicItem.destroy_all
    MagicArmorItem.destroy_all
    MagicWeaponItem.destroy_all
    MagicItemsUtil.import
  end

  task import_monsters: :environment do
    MonstersUtil.import
  end

  task import_races: :environment do
    Race.destroy_all
    RacesUtil.import
  end

  task import_spells: :environment do
    Spell.destroy_all
    SpellsUtil.import
  end

  task import_rules: :environment do
    Rule.destroy_all
    RulesUtil.import
  end

  task import_sections: :environment do
    Section.destroy_all
    SectionsUtil.import
  end

  task generate_actions: :environment do
    ItemsUtil.generate_actions_from_weapons
  end
end
