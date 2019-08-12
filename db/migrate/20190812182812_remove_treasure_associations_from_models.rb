# frozen_string_literal: true

class RemoveTreasureAssociationsFromModels < ActiveRecord::Migration[5.2]
  def change
    remove_reference :equipment_items, :treasure
  end
end
