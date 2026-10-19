class CreateDeviceLinks < ActiveRecord::Migration[7.1]
  def change
    create_table :device_links do |t|
      t.string :device_code_digest, null: false
      t.string :user_code, null: false
      t.string :world_id
      t.string :world_title
      t.references :user, foreign_key: true
      t.datetime :approved_at
      t.datetime :denied_at
      t.datetime :consumed_at
      t.datetime :last_polled_at
      t.datetime :expires_at, null: false
      t.timestamps
    end
    add_index :device_links, :device_code_digest, unique: true
    # A code can be reused once the link that held it has been picked up
    add_index :device_links, :user_code, unique: true, where: 'consumed_at IS NULL'
    add_index :device_links, :expires_at
  end
end
