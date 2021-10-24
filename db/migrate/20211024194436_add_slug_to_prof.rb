class AddSlugToProf < ActiveRecord::Migration[6.1]
  def change
    add_column :profs, :slug, :string
    change_column_null :profs, :slug, false
  end
end
