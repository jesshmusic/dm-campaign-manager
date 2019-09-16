class AddArmorClassBonusToArmorItems < ActiveRecord::Migration[5.2]
  def change
    add_column :items, :armor_class_bonus, :integer
  end
end
