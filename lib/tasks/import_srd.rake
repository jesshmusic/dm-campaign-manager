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

  task import_proficiencies: :environment do
    SrdUtilities.import_proficiencies
  end

  task import_classes: :environment do
    SrdUtilities.import_classes
  end

  task import_monsters: :environment do
    SrdUtilities.import_monsters
  end

  task import_spells: :environment do
    SrdUtilities.import_spells
  end

  task import_items: :environment do
    SrdUtilities.import_items
  end

  task import_and_fix_magic_items: :environment do
    SrdUtilities.import_and_fix_magic_items
  end

  task import_all: :environment do
    SrdUtilities.import_all
  end
end
