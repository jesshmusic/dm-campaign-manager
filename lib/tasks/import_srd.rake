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
    ImportSrdUtilities.import_dnd_classes
  end
end
