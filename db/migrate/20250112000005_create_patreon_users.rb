class CreatePatreonUsers < ActiveRecord::Migration[6.1]
  def change
    create_table :patreon_users do |t|
      t.string :user_id, null: false # UUID from Foundry module
      t.string :patreon_id
      t.string :email
      t.string :name
      t.boolean :has_free, default: true
      t.boolean :has_premium, default: false
      t.datetime :expires_at
      t.string :access_token
      t.string :refresh_token
      t.datetime :last_authenticated_at

      t.timestamps
    end

    add_index :patreon_users, :user_id, unique: true
    add_index :patreon_users, :patreon_id
    add_index :patreon_users, :expires_at
  end
end
