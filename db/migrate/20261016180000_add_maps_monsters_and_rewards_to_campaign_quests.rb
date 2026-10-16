class AddMapsMonstersAndRewardsToCampaignQuests < ActiveRecord::Migration[7.1]
  # A quest's maps (Foundry scenes), its reward coins, XP or milestone, and
  # links to the NPCs involved, its monsters and its reward items (with how
  # many of each), like a session's links.
  def change
    change_table :campaign_quests, bulk: true do |t|
      # [{ "uuid": "Scene.xxxx", "name": "Mountain Pass" }]
      t.jsonb :foundry_scenes, null: false, default: []
      # { "gp": 50, "sp": 12 }
      t.jsonb :reward_currency, null: false, default: {}
      t.integer :reward_xp
      # "Level up when done"
      t.boolean :milestone, null: false, default: false
    end

    create_table :campaign_quest_links do |t|
      t.references :quest, null: false, foreign_key: { to_table: :campaign_quests, on_delete: :cascade }
      t.references :linkable, polymorphic: true, null: false
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.integer :position, null: false, default: 0
      t.integer :quantity
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end
    add_index :campaign_quest_links, :uuid, unique: true
    add_index :campaign_quest_links, %i[quest_id linkable_type linkable_id], unique: true,
                                                                              name: 'index_campaign_quest_links_uniqueness'
  end
end
