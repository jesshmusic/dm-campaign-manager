class CreateEquipmentItems < ActiveRecord::Migration[6.1]
  def change
    add_reference :api_references, :equipment, optional: true
  end
end
