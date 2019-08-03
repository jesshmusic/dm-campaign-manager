class AddVehicleSpeedToItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :vehicle_speed, :integer
    add_column :items, :vehicle_speed_unit, :string
  end
end
