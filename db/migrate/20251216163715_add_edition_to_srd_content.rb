# frozen_string_literal: true

class AddEditionToSrdContent < ActiveRecord::Migration[7.1]
  def change
    # Add edition column to all SRD content tables
    tables = %i[
      rules
      monsters
      spells
      dnd_classes
      races
      items
      conditions
      sections
      skills
      ability_scores
      profs
    ]

    tables.each do |table|
      add_column table, :edition, :string, default: '2014', null: false
      add_index table, :edition
    end

    # Add user edition preference
    add_column :users, :preferred_edition, :string, default: '2024'
  end
end
