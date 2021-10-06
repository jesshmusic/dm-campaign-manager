class CreateRaceTraits < ActiveRecord::Migration[6.1]
  def change
    create_table :race_traits do |t|
      t.string :name
      t.string :desc, default: [], array: true
      t.references :race, null: false, foreign_key: true

      t.timestamps
    end

    Race.all.each do |race|
      race.traits.each do |trait|
        race.race_traits.create(name: trait['name'], desc: trait['desc'])
      end
    end

    remove_column :races, :traits
  end
end
