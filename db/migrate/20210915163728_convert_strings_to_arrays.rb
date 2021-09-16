class ConvertStringsToArrays < ActiveRecord::Migration[6.1]
  def change
    remove_column :class_features, :desc
    add_column :class_features, :desc, :string, array: true, default: []
  end
end
