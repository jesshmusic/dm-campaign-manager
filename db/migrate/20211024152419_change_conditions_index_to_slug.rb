class ChangeConditionsIndexToSlug < ActiveRecord::Migration[6.1]
  def up
    add_column :conditions, :slug, :string
    add_index :conditions, :slug, unique: true
    Condition.all.each do |condition|
      condition.slug = condition.index
      condition.save!
    end
    change_column_null :conditions, :slug, false
    remove_column :conditions, :index
  end

  def down
    add_column :conditions, :index, :string
    add_index :conditions, :index, unique: true
    Condition.all.each do |condition|
      condition.index = condition.slug
      condition.save!
    end
    change_column_null :conditions, :index, false
    remove_column :conditions, :slug
  end
end
