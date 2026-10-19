class CreatePlayerCharacters < ActiveRecord::Migration[7.1]
  # Player characters from a DM's Foundry worlds, sent by Dorman Lakely's
  # Campaign Planner. The sheet holds what the player built (stats, class
  # levels, and the names of spells, features and gear), never rules text
  # from the books. Each campaign picks its party from them.
  def change
    create_table :player_characters do |t|
      t.references :user, null: false, foreign_key: true, index: false
      t.string :world_id, null: false
      t.string :world_title
      t.string :foundry_uuid, null: false
      t.string :name, null: false
      t.string :player_name
      t.integer :level
      t.jsonb :sheet, null: false, default: {}
      t.timestamps
    end
    add_index :player_characters, %i[user_id world_id foundry_uuid], unique: true

    create_table :campaign_party_members do |t|
      t.references :campaign, null: false, foreign_key: { on_delete: :cascade }, index: false
      t.references :player_character, null: false, foreign_key: { on_delete: :cascade }
      t.timestamps
    end
    add_index :campaign_party_members, %i[campaign_id player_character_id], unique: true
  end
end
