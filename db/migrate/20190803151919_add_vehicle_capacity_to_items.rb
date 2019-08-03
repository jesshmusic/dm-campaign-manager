class AddVehicleCapacityToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :vehicle_capacity, :string
  end
end
