class AddSlugToProf < ActiveRecord::Migration[6.1]
  def change
    add_column :profs, :slug, :string
    Prof.all.each do |prof|
      prof.slug = prof.name.parameterize
      prof.save!
    end
    change_column_null :profs, :slug, false
  end
end
