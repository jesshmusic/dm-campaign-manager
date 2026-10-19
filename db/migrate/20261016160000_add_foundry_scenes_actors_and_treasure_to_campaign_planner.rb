class AddFoundryScenesActorsAndTreasureToCampaignPlanner < ActiveRecord::Migration[7.1]
  # Foundry links the DM picks in Dorman Lakely's Campaign Planner: a place's
  # scene, an NPC's actor and a session's scenes. Plus a session's treasure
  # coins, and how many of a linked item (usually a book reference) it gives.
  def change
    change_table :campaign_locations, bulk: true do |t|
      t.string :foundry_scene_uuid
      t.string :foundry_scene_name
    end

    change_table :campaign_npcs, bulk: true do |t|
      t.string :foundry_actor_uuid
      t.string :foundry_actor_name
    end

    change_table :campaign_sessions, bulk: true do |t|
      # [{ "uuid": "Scene.xxxx", "name": "Mountain Pass" }]
      t.jsonb :foundry_scenes, null: false, default: []
      # { "gp": 50, "sp": 12 }
      t.jsonb :treasure_currency, null: false, default: {}
    end

    add_column :campaign_session_links, :quantity, :integer
  end
end
