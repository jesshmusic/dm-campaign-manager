class AddTierNameToPatreonUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :patreon_users, :tier_name, :string
  end
end
