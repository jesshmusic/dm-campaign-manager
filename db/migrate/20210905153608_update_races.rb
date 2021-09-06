class UpdateRaces < ActiveRecord::Migration[6.1]
  def change
    add_column :races, :alignment, :text
    add_column :races, :age, :text
    add_column :races, :size, :string
    add_column :races, :size_description, :text
    add_column :races, :languages, :string, array: true, default: []
    add_column :races, :language_description, :text
    add_column :races, :traits, :jsonb, array:true, default: []
    remove_column :races, :speed
    add_column :races, :speed, :integer
  end
end
