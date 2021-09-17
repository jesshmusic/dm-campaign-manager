class RemoveUnitFromSenses < ActiveRecord::Migration[6.1]
  def change
    remove_column :senses, :unit
    remove_column :senses, :value
    add_column :senses, :value, :string
  end
end
