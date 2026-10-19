class CreateCampaignPlanner < ActiveRecord::Migration[7.1]
  # Every planner record carries a `uuid` (stable id shared with Foundry) and a
  # `sync_version` (per-campaign counter, bumped on each save) so the Foundry
  # module can pull "changes since N". Deletes leave a campaign_tombstone.
  def change
    create_table :campaigns do |t|
      t.references :user, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.string :name, null: false
      t.string :slug, null: false
      t.text :premise
      t.text :pitch
      t.string :setting_name
      t.text :setting_notes
      t.jsonb :truths, null: false, default: []
      t.string :mode, null: false, default: 'arc'
      t.string :status, null: false, default: 'planning'
      t.integer :planned_sessions
      t.string :cadence
      t.integer :party_size
      t.integer :start_level
      t.integer :target_level
      t.string :tone
      t.string :edition, null: false, default: '2024'
      t.bigint :sync_counter, null: false, default: 0
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end
    add_index :campaigns, :uuid, unique: true
    add_index :campaigns, %i[user_id slug], unique: true

    create_table :campaign_factions do |t|
      t.references :campaign, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.string :name, null: false
      t.text :description
      t.text :goal
      t.text :notes
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end

    create_table :campaign_locations do |t|
      t.references :campaign, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.references :parent, foreign_key: { to_table: :campaign_locations, on_delete: :nullify }
      t.references :foundry_map, foreign_key: { on_delete: :nullify }
      t.string :name, null: false
      t.text :description
      t.jsonb :features, null: false, default: []
      t.text :notes
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end

    create_table :campaign_npcs do |t|
      t.references :campaign, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.references :monster, foreign_key: { on_delete: :nullify }
      t.references :faction, foreign_key: { to_table: :campaign_factions, on_delete: :nullify }
      t.string :name, null: false
      t.string :role, null: false, default: 'neutral'
      t.text :description
      t.text :motive
      t.text :secret
      t.string :appearance
      t.string :voice
      t.text :notes
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end

    create_table :campaign_fronts do |t|
      t.references :campaign, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.references :npc, foreign_key: { to_table: :campaign_npcs, on_delete: :nullify }
      t.references :faction, foreign_key: { to_table: :campaign_factions, on_delete: :nullify }
      t.string :name, null: false
      t.text :description
      t.text :goal
      t.text :doom
      t.jsonb :stakes, null: false, default: []
      t.jsonb :portents, null: false, default: []
      t.integer :clock_segments, null: false, default: 6
      t.integer :clock_filled, null: false, default: 0
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end

    create_table :campaign_quests do |t|
      t.references :campaign, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.references :parent, foreign_key: { to_table: :campaign_quests, on_delete: :nullify }
      t.references :giver_npc, foreign_key: { to_table: :campaign_npcs, on_delete: :nullify }
      t.references :location, foreign_key: { to_table: :campaign_locations, on_delete: :nullify }
      t.string :name, null: false
      t.string :kind, null: false, default: 'main'
      t.string :status, null: false, default: 'available'
      t.text :description
      t.text :reward
      t.text :notes
      t.integer :act
      t.integer :position, null: false, default: 0
      t.integer :level_min
      t.integer :level_max
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end

    create_table :campaign_sessions do |t|
      t.references :campaign, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.integer :number, null: false
      t.string :title
      t.date :scheduled_on
      t.string :status, null: false, default: 'planned'
      t.integer :level
      t.text :character_notes
      t.text :strong_start
      t.jsonb :scenes, null: false, default: []
      t.text :treasure
      t.text :log
      t.text :recap
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end
    add_index :campaign_sessions, %i[campaign_id number], unique: true

    create_table :campaign_secrets do |t|
      t.references :campaign, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.references :revealed_session, foreign_key: { to_table: :campaign_sessions, on_delete: :nullify }
      t.text :text, null: false
      t.string :revelation
      t.datetime :revealed_at
      t.integer :position, null: false, default: 0
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end

    create_table :campaign_session_links do |t|
      t.references :session, null: false, foreign_key: { to_table: :campaign_sessions, on_delete: :cascade }
      t.references :linkable, polymorphic: true, null: false
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.integer :position, null: false, default: 0
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end
    add_index :campaign_session_links, %i[session_id linkable_type linkable_id], unique: true,
                                                                                  name: 'index_campaign_session_links_uniqueness'

    create_table :campaign_tombstones do |t|
      t.references :campaign, null: false, foreign_key: { on_delete: :cascade }
      t.string :record_type, null: false
      t.uuid :record_uuid, null: false
      t.bigint :sync_version, null: false
      t.datetime :created_at, null: false
    end
    add_index :campaign_tombstones, %i[campaign_id sync_version]

    %i[campaign_factions campaign_locations campaign_npcs campaign_fronts campaign_quests campaign_sessions
       campaign_secrets campaign_session_links].each do |table|
      add_index table, :uuid, unique: true
    end
    %i[campaign_factions campaign_locations campaign_npcs campaign_fronts campaign_quests campaign_sessions
       campaign_secrets].each do |table|
      add_index table, %i[campaign_id sync_version]
    end
  end
end
