class LinkPatreonUsersToUsers < ActiveRecord::Migration[7.1]
  def change
    # Patreon accounts linked from the web app belong to a DM Guru user.
    # Foundry module logins keep using the module-generated user_id instead,
    # so user_id becomes optional for web-linked rows.
    add_reference :patreon_users, :linked_user, foreign_key: { to_table: :users }, index: { unique: true }
    change_column_null :patreon_users, :user_id, true
  end
end
