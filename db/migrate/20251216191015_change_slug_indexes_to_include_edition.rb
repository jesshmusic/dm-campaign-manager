# frozen_string_literal: true

# Change unique slug indexes to be unique on [slug, edition] instead of just [slug]
# This allows the same slug to exist for different editions (e.g., "aboleth" for both 2014 and 2024)
class ChangeSlugIndexesToIncludeEdition < ActiveRecord::Migration[7.1]
  def change
    # Tables with slug that need to be unique per edition
    tables_with_slug = %i[
      monsters
      spells
      dnd_classes
      races
      items
      conditions
      rules
      sections
      skills
      profs
    ]

    tables_with_slug.each do |table|
      # Check if the table has a slug column and unique index
      if column_exists?(table, :slug) && column_exists?(table, :edition)
        # Remove old unique index on slug if it exists
        if index_exists?(table, :slug, unique: true)
          remove_index table, :slug
        end

        # Add new composite unique index on slug + edition
        unless index_exists?(table, %i[slug edition], unique: true)
          add_index table, %i[slug edition], unique: true
        end
      end
    end
  end
end
