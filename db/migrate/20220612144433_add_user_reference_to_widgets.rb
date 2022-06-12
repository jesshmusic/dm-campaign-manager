class AddUserReferenceToWidgets < ActiveRecord::Migration[6.1]
  def change
    add_reference :widgets, :user
  end
end
