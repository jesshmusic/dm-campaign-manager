class AddSortToAdventures < ActiveRecord::Migration[5.2]
  def up
    add_column :adventures, :sort, :integer, default: 0, null: false
    add_column :encounters, :sort, :integer, default: 0, null: false

    Campaign.all.each do |campaign|
      campaign.adventures.each_with_index { |adventure, index |
        adventure.sort = index
        adventure.save!
        adventure.encounters.each_with_index { |encounter, encounter_index |
          encounter.sort = encounter_index
          encounter.save!
        }
      }
    end
  end

  def down
    remove_column :adventures, :sort
    remove_column :encounters, :sort
  end
end
