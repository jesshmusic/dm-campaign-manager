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

  task import_dnd_classes: :environment do
    DndClass.destroy_all
    DndClassesUtil.import_dnd_classes
  end

  task import_monsters: :environment do
    Monster.destroy_all
    MonstersUtil.import
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
end
