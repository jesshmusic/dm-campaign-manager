class AddWhenToEvents < ActiveRecord::Migration[5.2]
  def change
    add_column :events, :when, :string
  end
end
