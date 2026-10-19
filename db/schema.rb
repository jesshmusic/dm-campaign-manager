# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.1].define(version: 2026_10_16_180000) do
  create_schema "heroku_ext"

  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_stat_statements"
  enable_extension "plpgsql"

  create_table "ability_bonus_options", force: :cascade do |t|
    t.string "ability"
    t.integer "bonus"
    t.bigint "race_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["race_id"], name: "index_ability_bonus_options_on_race_id"
  end

  create_table "ability_score_dnd_classes", force: :cascade do |t|
    t.bigint "dnd_class_id", null: false
    t.bigint "ability_score_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ability_score_id"], name: "index_ability_score_dnd_classes_on_ability_score_id"
    t.index ["dnd_class_id"], name: "index_ability_score_dnd_classes_on_dnd_class_id"
  end

  create_table "ability_scores", force: :cascade do |t|
    t.string "desc", default: [], array: true
    t.string "full_name"
    t.string "name"
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "edition", default: "2014", null: false
    t.index ["edition"], name: "index_ability_scores_on_edition"
    t.index ["slug"], name: "index_ability_scores_on_slug", unique: true
  end

  create_table "actions", force: :cascade do |t|
    t.string "desc"
    t.string "name"
    t.bigint "monster_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "type"
    t.index ["monster_id"], name: "index_actions_on_monster_id"
  end

  create_table "api_references", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.string "api_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "equipment_id"
    t.index ["equipment_id"], name: "index_api_references_on_equipment_id"
    t.index ["slug"], name: "index_api_references_on_slug", unique: true
  end

  create_table "api_tokens", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "name", null: false
    t.string "token_digest", null: false
    t.string "token_prefix", null: false
    t.datetime "last_used_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["token_digest"], name: "index_api_tokens_on_token_digest", unique: true
    t.index ["user_id"], name: "index_api_tokens_on_user_id"
  end

  create_table "armor_classes", force: :cascade do |t|
    t.integer "ac_base"
    t.boolean "has_dex_bonus"
    t.integer "max_dex_bonus"
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_armor_classes_on_item_id"
  end

  create_table "backgrounds", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.string "edition", default: "2024", null: false
    t.string "ability_scores", default: [], array: true
    t.string "feat_name"
    t.string "skill_proficiencies", default: [], array: true
    t.string "tool_proficiency"
    t.text "equipment_option_a"
    t.text "equipment_option_b"
    t.text "description"
    t.boolean "homebrew", default: false, null: false
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["edition"], name: "index_backgrounds_on_edition"
    t.index ["homebrew"], name: "index_backgrounds_on_homebrew"
    t.index ["slug", "edition"], name: "index_backgrounds_on_slug_and_edition", unique: true
    t.index ["user_id"], name: "index_backgrounds_on_user_id"
  end

  create_table "campaign_factions", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "name", null: false
    t.text "description"
    t.text "goal"
    t.text "notes"
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id", "sync_version"], name: "index_campaign_factions_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_factions_on_campaign_id"
    t.index ["uuid"], name: "index_campaign_factions_on_uuid", unique: true
  end

  create_table "campaign_fronts", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "npc_id"
    t.bigint "faction_id"
    t.string "name", null: false
    t.text "description"
    t.text "goal"
    t.text "doom"
    t.jsonb "stakes", default: [], null: false
    t.jsonb "portents", default: [], null: false
    t.integer "clock_segments", default: 6, null: false
    t.integer "clock_filled", default: 0, null: false
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id", "sync_version"], name: "index_campaign_fronts_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_fronts_on_campaign_id"
    t.index ["faction_id"], name: "index_campaign_fronts_on_faction_id"
    t.index ["npc_id"], name: "index_campaign_fronts_on_npc_id"
    t.index ["uuid"], name: "index_campaign_fronts_on_uuid", unique: true
  end

  create_table "campaign_locations", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "parent_id"
    t.bigint "foundry_map_id"
    t.string "name", null: false
    t.text "description"
    t.jsonb "features", default: [], null: false
    t.text "notes"
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "foundry_scene_uuid"
    t.string "foundry_scene_name"
    t.index ["campaign_id", "sync_version"], name: "index_campaign_locations_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_locations_on_campaign_id"
    t.index ["foundry_map_id"], name: "index_campaign_locations_on_foundry_map_id"
    t.index ["parent_id"], name: "index_campaign_locations_on_parent_id"
    t.index ["uuid"], name: "index_campaign_locations_on_uuid", unique: true
  end

  create_table "campaign_npcs", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "monster_id"
    t.bigint "faction_id"
    t.string "name", null: false
    t.string "role", default: "neutral", null: false
    t.text "description"
    t.text "motive"
    t.text "secret"
    t.string "appearance"
    t.string "voice"
    t.text "notes"
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "stat_block_reference_id"
    t.string "foundry_actor_uuid"
    t.string "foundry_actor_name"
    t.index ["campaign_id", "sync_version"], name: "index_campaign_npcs_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_npcs_on_campaign_id"
    t.index ["faction_id"], name: "index_campaign_npcs_on_faction_id"
    t.index ["monster_id"], name: "index_campaign_npcs_on_monster_id"
    t.index ["stat_block_reference_id"], name: "index_campaign_npcs_on_stat_block_reference_id"
    t.index ["uuid"], name: "index_campaign_npcs_on_uuid", unique: true
  end

  create_table "campaign_party_members", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.bigint "player_character_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id", "player_character_id"], name: "idx_on_campaign_id_player_character_id_c6c43d9df3", unique: true
    t.index ["player_character_id"], name: "index_campaign_party_members_on_player_character_id"
  end

  create_table "campaign_quest_links", force: :cascade do |t|
    t.bigint "quest_id", null: false
    t.string "linkable_type", null: false
    t.bigint "linkable_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "position", default: 0, null: false
    t.integer "quantity"
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["linkable_type", "linkable_id"], name: "index_campaign_quest_links_on_linkable"
    t.index ["quest_id", "linkable_type", "linkable_id"], name: "index_campaign_quest_links_uniqueness", unique: true
    t.index ["quest_id"], name: "index_campaign_quest_links_on_quest_id"
    t.index ["uuid"], name: "index_campaign_quest_links_on_uuid", unique: true
  end

  create_table "campaign_quests", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "parent_id"
    t.bigint "giver_npc_id"
    t.bigint "location_id"
    t.string "name", null: false
    t.string "kind", default: "main", null: false
    t.string "status", default: "available", null: false
    t.text "description"
    t.text "reward"
    t.text "notes"
    t.integer "act"
    t.integer "position", default: 0, null: false
    t.integer "level_min"
    t.integer "level_max"
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "foundry_scenes", default: [], null: false
    t.jsonb "reward_currency", default: {}, null: false
    t.integer "reward_xp"
    t.boolean "milestone", default: false, null: false
    t.index ["campaign_id", "sync_version"], name: "index_campaign_quests_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_quests_on_campaign_id"
    t.index ["giver_npc_id"], name: "index_campaign_quests_on_giver_npc_id"
    t.index ["location_id"], name: "index_campaign_quests_on_location_id"
    t.index ["parent_id"], name: "index_campaign_quests_on_parent_id"
    t.index ["uuid"], name: "index_campaign_quests_on_uuid", unique: true
  end

  create_table "campaign_references", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "name", null: false
    t.string "book", default: "mm", null: false
    t.string "category", default: "monster", null: false
    t.integer "page"
    t.string "challenge_rating"
    t.string "foundry_uuid"
    t.text "notes"
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id", "sync_version"], name: "index_campaign_references_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_references_on_campaign_id"
    t.index ["uuid"], name: "index_campaign_references_on_uuid", unique: true
  end

  create_table "campaign_secrets", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.bigint "revealed_session_id"
    t.text "text", null: false
    t.string "revelation"
    t.datetime "revealed_at"
    t.integer "position", default: 0, null: false
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id", "sync_version"], name: "index_campaign_secrets_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_secrets_on_campaign_id"
    t.index ["revealed_session_id"], name: "index_campaign_secrets_on_revealed_session_id"
    t.index ["uuid"], name: "index_campaign_secrets_on_uuid", unique: true
  end

  create_table "campaign_session_links", force: :cascade do |t|
    t.bigint "session_id", null: false
    t.string "linkable_type", null: false
    t.bigint "linkable_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "position", default: 0, null: false
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "quantity"
    t.index ["linkable_type", "linkable_id"], name: "index_campaign_session_links_on_linkable"
    t.index ["session_id", "linkable_type", "linkable_id"], name: "index_campaign_session_links_uniqueness", unique: true
    t.index ["session_id"], name: "index_campaign_session_links_on_session_id"
    t.index ["uuid"], name: "index_campaign_session_links_on_uuid", unique: true
  end

  create_table "campaign_sessions", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.integer "number", null: false
    t.string "title"
    t.date "scheduled_on"
    t.string "status", default: "planned", null: false
    t.integer "level"
    t.text "character_notes"
    t.text "strong_start"
    t.jsonb "scenes", default: [], null: false
    t.text "treasure"
    t.text "log"
    t.text "recap"
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "foundry_scenes", default: [], null: false
    t.jsonb "treasure_currency", default: {}, null: false
    t.index ["campaign_id", "number"], name: "index_campaign_sessions_on_campaign_id_and_number", unique: true
    t.index ["campaign_id", "sync_version"], name: "index_campaign_sessions_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_sessions_on_campaign_id"
    t.index ["uuid"], name: "index_campaign_sessions_on_uuid", unique: true
  end

  create_table "campaign_tombstones", force: :cascade do |t|
    t.bigint "campaign_id", null: false
    t.string "record_type", null: false
    t.uuid "record_uuid", null: false
    t.bigint "sync_version", null: false
    t.datetime "created_at", null: false
    t.index ["campaign_id", "sync_version"], name: "index_campaign_tombstones_on_campaign_id_and_sync_version"
    t.index ["campaign_id"], name: "index_campaign_tombstones_on_campaign_id"
  end

  create_table "campaigns", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.uuid "uuid", default: -> { "gen_random_uuid()" }, null: false
    t.string "name", null: false
    t.string "slug", null: false
    t.text "premise"
    t.text "pitch"
    t.string "setting_name"
    t.text "setting_notes"
    t.jsonb "truths", default: [], null: false
    t.string "mode", default: "arc", null: false
    t.string "status", default: "planning", null: false
    t.integer "planned_sessions"
    t.string "cadence"
    t.integer "party_size"
    t.integer "start_level"
    t.integer "target_level"
    t.string "tone"
    t.string "edition", default: "2024", null: false
    t.bigint "sync_counter", default: 0, null: false
    t.bigint "sync_version", default: 0, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.jsonb "excluded_compendium_packs", default: [], null: false
    t.index ["user_id", "slug"], name: "index_campaigns_on_user_id_and_slug", unique: true
    t.index ["user_id"], name: "index_campaigns_on_user_id"
    t.index ["uuid"], name: "index_campaigns_on_uuid", unique: true
  end

  create_table "class_features", force: :cascade do |t|
    t.integer "level"
    t.string "name"
    t.string "reference"
    t.bigint "dnd_class_level_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "desc", default: [], array: true
    t.index ["dnd_class_level_id"], name: "index_class_features_on_dnd_class_level_id"
  end

  create_table "class_level_choices", force: :cascade do |t|
    t.bigint "class_feature_id", null: false
    t.integer "num_choices"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "choices", default: [], array: true
    t.index ["class_feature_id"], name: "index_class_level_choices_on_class_feature_id"
  end

  create_table "class_specific_dices", force: :cascade do |t|
    t.integer "dice_count"
    t.integer "dice_value"
    t.bigint "class_specific_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["class_specific_id"], name: "index_class_specific_dices_on_class_specific_id"
  end

  create_table "class_specific_spell_slots", force: :cascade do |t|
    t.integer "sorcery_point_cost"
    t.integer "spell_slot_level"
    t.bigint "class_specific_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["class_specific_id"], name: "index_class_specific_spell_slots_on_class_specific_id"
  end

  create_table "class_specifics", force: :cascade do |t|
    t.bigint "dnd_class_level_id", null: false
    t.string "name"
    t.string "index"
    t.string "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dnd_class_level_id"], name: "index_class_specifics_on_dnd_class_level_id"
  end

  create_table "class_spellcastings", force: :cascade do |t|
    t.integer "cantrips_known"
    t.integer "spells_known"
    t.integer "spell_slots_level_1"
    t.integer "spell_slots_level_2"
    t.integer "spell_slots_level_3"
    t.integer "spell_slots_level_4"
    t.integer "spell_slots_level_5"
    t.integer "spell_slots_level_6"
    t.integer "spell_slots_level_7"
    t.integer "spell_slots_level_8"
    t.integer "spell_slots_level_9"
    t.bigint "dnd_class_level_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dnd_class_level_id"], name: "index_class_spellcastings_on_dnd_class_level_id"
  end

  create_table "compendium_entries", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "pack", null: false
    t.string "pack_version"
    t.string "foundry_uuid", null: false
    t.string "name", null: false
    t.string "category", null: false
    t.string "challenge_rating"
    t.string "detail"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "category", "name"], name: "index_compendium_entries_on_user_id_and_category_and_name"
    t.index ["user_id", "foundry_uuid"], name: "index_compendium_entries_on_user_id_and_foundry_uuid", unique: true
    t.index ["user_id", "pack"], name: "index_compendium_entries_on_user_id_and_pack"
  end

  create_table "container_items", force: :cascade do |t|
    t.bigint "item_id"
    t.bigint "contained_item_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["contained_item_id"], name: "index_container_items_on_contained_item_id"
    t.index ["item_id", "contained_item_id"], name: "index_container_items_on_item_id_and_contained_item_id", unique: true
    t.index ["item_id"], name: "index_container_items_on_item_id"
  end

  create_table "content_items", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", null: false
    t.string "index", null: false
    t.integer "quantity", default: 1
    t.index ["item_id"], name: "index_content_items_on_item_id"
  end

  create_table "costs", force: :cascade do |t|
    t.integer "quantity"
    t.string "unit"
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_costs_on_item_id"
  end

  create_table "damages", force: :cascade do |t|
    t.string "damage_type"
    t.string "damage_dice"
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_damages_on_item_id"
  end

  create_table "dnd_class_levels", force: :cascade do |t|
    t.integer "ability_score_bonuses"
    t.bigint "dnd_class_id", null: false
    t.integer "level"
    t.integer "prof_bonus"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dnd_class_id"], name: "index_dnd_class_levels_on_dnd_class_id"
  end

  create_table "dnd_classes", force: :cascade do |t|
    t.string "name"
    t.integer "hit_die"
    t.string "api_url"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "user_id"
    t.string "slug"
    t.string "spell_ability"
    t.string "subclasses", default: [], array: true
    t.string "edition", default: "2014", null: false
    t.string "primary_abilities"
    t.index ["edition"], name: "index_dnd_classes_on_edition"
    t.index ["slug", "edition"], name: "index_dnd_classes_on_slug_and_edition", unique: true
    t.index ["user_id"], name: "index_dnd_classes_on_user_id"
  end

  create_table "equipment", force: :cascade do |t|
    t.integer "quantity"
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "starting_equipment_option_id"
    t.bigint "dnd_class_id"
    t.index ["dnd_class_id"], name: "index_equipment_on_dnd_class_id"
    t.index ["starting_equipment_option_id"], name: "index_equipment_on_starting_equipment_option_id"
  end

  create_table "feats", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.string "edition", default: "2024", null: false
    t.string "category", null: false
    t.string "prerequisite"
    t.text "description", null: false
    t.boolean "repeatable", default: false, null: false
    t.boolean "homebrew", default: false, null: false
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_feats_on_category"
    t.index ["edition"], name: "index_feats_on_edition"
    t.index ["homebrew"], name: "index_feats_on_homebrew"
    t.index ["slug", "edition"], name: "index_feats_on_slug_and_edition", unique: true
    t.index ["user_id"], name: "index_feats_on_user_id"
  end

  create_table "foundry_map_files", force: :cascade do |t|
    t.bigint "foundry_map_id", null: false
    t.string "file_path", null: false
    t.string "file_type", null: false
    t.bigint "file_size"
    t.string "s3_key", null: false
    t.string "content_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["file_type"], name: "index_foundry_map_files_on_file_type"
    t.index ["foundry_map_id"], name: "index_foundry_map_files_on_foundry_map_id"
    t.index ["s3_key"], name: "index_foundry_map_files_on_s3_key", unique: true
  end

  create_table "foundry_map_taggings", force: :cascade do |t|
    t.bigint "foundry_map_id", null: false
    t.bigint "foundry_map_tag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["foundry_map_id", "foundry_map_tag_id"], name: "index_map_taggings_on_map_and_tag", unique: true
    t.index ["foundry_map_id"], name: "index_foundry_map_taggings_on_foundry_map_id"
    t.index ["foundry_map_tag_id"], name: "index_foundry_map_taggings_on_foundry_map_tag_id"
  end

  create_table "foundry_map_tags", force: :cascade do |t|
    t.string "name", null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_foundry_map_tags_on_name"
    t.index ["slug"], name: "index_foundry_map_tags_on_slug", unique: true
  end

  create_table "foundry_maps", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.string "thumbnail_url"
    t.string "access_level", default: "premium", null: false
    t.integer "grid_size"
    t.string "grid_units"
    t.integer "width"
    t.integer "height"
    t.boolean "published", default: false
    t.integer "download_count", default: 0
    t.json "keywords", default: []
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "thumbnail_s3_key"
    t.string "required_tier", default: "free"
    t.index ["access_level"], name: "index_foundry_maps_on_access_level"
    t.index ["created_at"], name: "index_foundry_maps_on_created_at"
    t.index ["published"], name: "index_foundry_maps_on_published"
  end

  create_table "foundry_scenes", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "world_id", null: false
    t.string "world_title"
    t.string "foundry_uuid", null: false
    t.string "name", null: false
    t.string "version", null: false
    t.string "thumbnail_s3_key", null: false
    t.string "thumbnail_url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "foundry_uuid"], name: "index_foundry_scenes_on_user_id_and_foundry_uuid"
    t.index ["user_id", "world_id", "foundry_uuid"], name: "index_foundry_scenes_on_user_id_and_world_id_and_foundry_uuid", unique: true
  end

  create_table "friendly_id_slugs", force: :cascade do |t|
    t.string "slug", null: false
    t.integer "sluggable_id", null: false
    t.string "sluggable_type", limit: 50
    t.string "scope"
    t.datetime "created_at", precision: nil
    t.index ["slug", "sluggable_type", "scope"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type_and_scope", unique: true
    t.index ["slug", "sluggable_type"], name: "index_friendly_id_slugs_on_slug_and_sluggable_type"
    t.index ["sluggable_type", "sluggable_id"], name: "index_friendly_id_slugs_on_sluggable_type_and_sluggable_id"
  end

  create_table "item_ranges", force: :cascade do |t|
    t.integer "long"
    t.integer "normal"
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_item_ranges_on_item_id"
  end

  create_table "item_throw_ranges", force: :cascade do |t|
    t.integer "long"
    t.integer "normal"
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_item_throw_ranges_on_item_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.integer "str_minimum"
    t.boolean "stealth_disadvantage"
    t.string "weapon_range"
    t.string "category_range"
    t.integer "weight"
    t.string "api_url"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "user_id"
    t.string "slug"
    t.string "rarity"
    t.string "requires_attunement"
    t.string "type"
    t.integer "armor_class_bonus"
    t.string "armor_category"
    t.string "capacity"
    t.string "desc", default: [], array: true
    t.string "equipment_category"
    t.string "gear_category"
    t.string "properties", default: [], array: true
    t.integer "quantity"
    t.string "special", default: [], array: true
    t.string "tool_category"
    t.string "vehicle_category"
    t.string "weapon_category"
    t.string "magic_item_type"
    t.string "speed"
    t.string "edition", default: "2014", null: false
    t.string "mastery"
    t.index ["armor_category"], name: "index_items_on_armor_category"
    t.index ["category_range"], name: "index_items_on_category_range"
    t.index ["edition"], name: "index_items_on_edition"
    t.index ["slug", "edition"], name: "index_items_on_slug_and_edition", unique: true
    t.index ["tool_category"], name: "index_items_on_tool_category"
    t.index ["user_id"], name: "index_items_on_user_id"
    t.index ["vehicle_category"], name: "index_items_on_vehicle_category"
    t.index ["weapon_category"], name: "index_items_on_weapon_category"
  end

  create_table "martial_arts", force: :cascade do |t|
    t.integer "dice_count"
    t.integer "dice_value"
    t.bigint "class_specific_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["class_specific_id"], name: "index_martial_arts_on_class_specific_id"
  end

  create_table "monster_proficiencies", force: :cascade do |t|
    t.bigint "monster_id"
    t.bigint "prof_id"
    t.integer "value"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["monster_id"], name: "index_monster_proficiencies_on_monster_id"
    t.index ["prof_id"], name: "index_monster_proficiencies_on_prof_id"
  end

  create_table "monsters", force: :cascade do |t|
    t.string "name"
    t.string "size"
    t.string "monster_type"
    t.string "monster_subtype"
    t.string "alignment"
    t.string "languages"
    t.string "challenge_rating"
    t.string "api_url"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "user_id"
    t.string "slug"
    t.integer "armor_class", default: 10
    t.integer "charisma", default: 10, null: false
    t.integer "constitution", default: 10, null: false
    t.integer "dexterity", default: 10, null: false
    t.integer "hit_points", default: 8, null: false
    t.integer "intelligence", default: 10, null: false
    t.integer "strength", default: 10, null: false
    t.integer "wisdom", default: 10, null: false
    t.string "hit_dice"
    t.integer "attack_bonus"
    t.integer "xp"
    t.integer "save_dc", default: 13
    t.integer "prof_bonus", default: 2
    t.string "condition_immunities", default: [], array: true
    t.string "damage_immunities", default: [], array: true
    t.string "damage_resistances", default: [], array: true
    t.string "damage_vulnerabilities", default: [], array: true
    t.text "description"
    t.string "edition", default: "2014", null: false
    t.index ["edition"], name: "index_monsters_on_edition"
    t.index ["slug", "edition"], name: "index_monsters_on_slug_and_edition", unique: true
    t.index ["user_id"], name: "index_monsters_on_user_id"
  end

  create_table "multi_class_prereqs", force: :cascade do |t|
    t.string "ability_score"
    t.integer "minimum_score"
    t.bigint "multi_classing_id"
    t.bigint "multi_classing_prereq_option_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["multi_classing_id"], name: "index_multi_class_prereqs_on_multi_classing_id"
    t.index ["multi_classing_prereq_option_id"], name: "index_multi_class_prereqs_on_multi_classing_prereq_option_id"
  end

  create_table "multi_classing_prereq_options", force: :cascade do |t|
    t.bigint "multi_classing_id", null: false
    t.integer "choose"
    t.string "prereq_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["multi_classing_id"], name: "index_multi_classing_prereq_options_on_multi_classing_id"
  end

  create_table "multi_classing_profs", force: :cascade do |t|
    t.bigint "prof_id", null: false
    t.bigint "multi_classing_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["multi_classing_id"], name: "index_multi_classing_profs_on_multi_classing_id"
    t.index ["prof_id"], name: "index_multi_classing_profs_on_prof_id"
  end

  create_table "multi_classings", force: :cascade do |t|
    t.bigint "dnd_class_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dnd_class_id"], name: "index_multi_classings_on_dnd_class_id"
  end

  create_table "patreon_users", force: :cascade do |t|
    t.string "user_id"
    t.string "patreon_id"
    t.string "email"
    t.string "name"
    t.boolean "has_free", default: true
    t.boolean "has_premium", default: false
    t.datetime "expires_at", precision: nil
    t.string "access_token"
    t.string "refresh_token"
    t.datetime "last_authenticated_at", precision: nil
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "tier_name"
    t.bigint "linked_user_id"
    t.index ["expires_at"], name: "index_patreon_users_on_expires_at"
    t.index ["linked_user_id"], name: "index_patreon_users_on_linked_user_id", unique: true
    t.index ["patreon_id"], name: "index_patreon_users_on_patreon_id"
    t.index ["user_id"], name: "index_patreon_users_on_user_id", unique: true
  end

  create_table "pg_search_documents", force: :cascade do |t|
    t.text "content"
    t.string "searchable_type"
    t.string "searchable_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["searchable_type", "searchable_id"], name: "index_pg_search_documents_on_searchable"
  end

  create_table "player_characters", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "world_id", null: false
    t.string "world_title"
    t.string "foundry_uuid", null: false
    t.string "name", null: false
    t.string "player_name"
    t.integer "level"
    t.jsonb "sheet", default: {}, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "world_id", "foundry_uuid"], name: "idx_on_user_id_world_id_foundry_uuid_9ad0edfc57", unique: true
  end

  create_table "prerequisites", force: :cascade do |t|
    t.string "name"
    t.integer "level"
    t.bigint "class_feature_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["class_feature_id"], name: "index_prerequisites_on_class_feature_id"
  end

  create_table "prof_choice_profs", force: :cascade do |t|
    t.bigint "prof_id"
    t.bigint "prof_choice_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["prof_choice_id"], name: "index_prof_choice_profs_on_prof_choice_id"
    t.index ["prof_id"], name: "index_prof_choice_profs_on_prof_id"
  end

  create_table "prof_choices", force: :cascade do |t|
    t.integer "num_choices"
    t.string "prof_choice_type"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "name"
    t.bigint "dnd_class_id"
    t.bigint "multi_classing_id"
    t.index ["dnd_class_id"], name: "index_prof_choices_on_dnd_class_id"
    t.index ["multi_classing_id"], name: "index_prof_choices_on_multi_classing_id"
  end

  create_table "prof_classes", force: :cascade do |t|
    t.bigint "prof_id"
    t.bigint "dnd_class_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["dnd_class_id"], name: "index_prof_classes_on_dnd_class_id"
    t.index ["prof_id"], name: "index_prof_classes_on_prof_id"
  end

  create_table "profs", force: :cascade do |t|
    t.string "name"
    t.string "prof_type"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "slug", null: false
    t.string "edition", default: "2014", null: false
    t.index ["edition"], name: "index_profs_on_edition"
    t.index ["name"], name: "index_profs_on_name", unique: true
    t.index ["slug", "edition"], name: "index_profs_on_slug_and_edition", unique: true
  end

  create_table "profs_races", id: false, force: :cascade do |t|
    t.bigint "race_id", null: false
    t.bigint "prof_id", null: false
    t.index ["race_id", "prof_id"], name: "index_profs_races_on_race_id_and_prof_id"
  end

  create_table "race_traits", force: :cascade do |t|
    t.string "name"
    t.string "desc", default: [], array: true
    t.bigint "race_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["race_id"], name: "index_race_traits_on_race_id"
  end

  create_table "races", force: :cascade do |t|
    t.string "name", default: "New Race...", null: false
    t.string "slug", null: false
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.bigint "user_id"
    t.text "alignment"
    t.text "age"
    t.string "size"
    t.text "size_description"
    t.string "languages", default: [], array: true
    t.text "language_description"
    t.integer "speed"
    t.integer "starting_languages"
    t.string "language_choices", default: [], array: true
    t.integer "ability_bonus_options"
    t.string "ability_bonus_option_choices", default: [], array: true
    t.string "subraces", default: [], array: true
    t.string "edition", default: "2014", null: false
    t.index ["edition"], name: "index_races_on_edition"
    t.index ["name"], name: "index_races_on_name"
    t.index ["slug", "edition"], name: "index_races_on_slug_and_edition", unique: true
    t.index ["slug"], name: "index_races_on_slug"
    t.index ["user_id"], name: "index_races_on_user_id"
  end

  create_table "rules", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "category"
    t.string "subcategory"
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "parent_id"
    t.string "edition", default: "2014", null: false
    t.integer "sort_order"
    t.string "game_icon"
    t.index ["edition"], name: "index_rules_on_edition"
    t.index ["parent_id"], name: "index_rules_on_parent_id"
    t.index ["slug", "edition"], name: "index_rules_on_slug_and_edition", unique: true
  end

  create_table "sections", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "slug"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "edition", default: "2014", null: false
    t.index ["edition"], name: "index_sections_on_edition"
    t.index ["slug", "edition"], name: "index_sections_on_slug_and_edition", unique: true
  end

  create_table "senses", force: :cascade do |t|
    t.string "name"
    t.bigint "monster_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "value"
    t.index ["monster_id"], name: "index_senses_on_monster_id"
  end

  create_table "skills", force: :cascade do |t|
    t.string "slug"
    t.string "name"
    t.string "desc"
    t.string "ability_score"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "edition", default: "2014", null: false
    t.index ["edition"], name: "index_skills_on_edition"
    t.index ["slug", "edition"], name: "index_skills_on_slug_and_edition", unique: true
  end

  create_table "sneak_attacks", force: :cascade do |t|
    t.integer "dice_count"
    t.integer "dice_value"
    t.bigint "class_specific_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["class_specific_id"], name: "index_sneak_attacks_on_class_specific_id"
  end

  create_table "speeds", force: :cascade do |t|
    t.integer "value"
    t.string "name"
    t.bigint "monster_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["monster_id"], name: "index_speeds_on_monster_id"
  end

  create_table "spell_casting_abilities", force: :cascade do |t|
    t.bigint "spell_casting_id", null: false
    t.bigint "ability_score_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ability_score_id"], name: "index_spell_casting_abilities_on_ability_score_id"
    t.index ["spell_casting_id"], name: "index_spell_casting_abilities_on_spell_casting_id"
  end

  create_table "spell_casting_infos", force: :cascade do |t|
    t.string "name"
    t.bigint "spell_casting_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "desc", default: [], array: true
    t.index ["spell_casting_id"], name: "index_spell_casting_infos_on_spell_casting_id"
  end

  create_table "spell_castings", force: :cascade do |t|
    t.integer "level"
    t.bigint "dnd_class_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dnd_class_id"], name: "index_spell_castings_on_dnd_class_id"
  end

  create_table "spell_classes", force: :cascade do |t|
    t.bigint "spell_id"
    t.bigint "dnd_class_id"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.index ["dnd_class_id"], name: "index_spell_classes_on_dnd_class_id"
    t.index ["spell_id"], name: "index_spell_classes_on_spell_id"
  end

  create_table "spells", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.text "higher_level"
    t.string "page"
    t.string "range"
    t.text "components", default: [], array: true
    t.string "material"
    t.boolean "ritual"
    t.string "duration"
    t.boolean "concentration"
    t.string "casting_time"
    t.integer "level"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.string "school"
    t.string "api_url"
    t.string "spell_level"
    t.bigint "user_id"
    t.string "slug"
    t.string "edition", default: "2014", null: false
    t.index ["edition"], name: "index_spells_on_edition"
    t.index ["slug", "edition"], name: "index_spells_on_slug_and_edition", unique: true
    t.index ["user_id"], name: "index_spells_on_user_id"
  end

  create_table "starting_equipment_options", force: :cascade do |t|
    t.integer "choose"
    t.string "equipment_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "dnd_class_id"
    t.bigint "equipment_option_id"
    t.string "equipment_category"
    t.index ["dnd_class_id"], name: "index_starting_equipment_options_on_dnd_class_id"
    t.index ["equipment_option_id"], name: "index_starting_equipment_options_on_equipment_option_id"
  end

  create_table "two_handed_damages", force: :cascade do |t|
    t.string "damage_type"
    t.string "damage_dice"
    t.bigint "item_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["item_id"], name: "index_two_handed_damages_on_item_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at", precision: nil
    t.datetime "remember_created_at", precision: nil
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at", precision: nil
    t.datetime "last_sign_in_at", precision: nil
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at", precision: nil
    t.datetime "confirmation_sent_at", precision: nil
    t.string "unconfirmed_email"
    t.datetime "created_at", precision: nil, null: false
    t.datetime "updated_at", precision: nil, null: false
    t.integer "role"
    t.string "name"
    t.string "username"
    t.datetime "deleted_at", precision: nil
    t.string "location"
    t.text "info"
    t.string "auth_id", default: "", null: false
    t.string "preferred_edition", default: "2024"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "widgets", force: :cascade do |t|
    t.text "title"
    t.text "subtitle"
    t.text "content"
    t.text "icon"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["user_id"], name: "index_widgets_on_user_id"
  end

  add_foreign_key "ability_bonus_options", "races"
  add_foreign_key "ability_score_dnd_classes", "ability_scores"
  add_foreign_key "ability_score_dnd_classes", "dnd_classes"
  add_foreign_key "actions", "monsters"
  add_foreign_key "api_tokens", "users"
  add_foreign_key "armor_classes", "items"
  add_foreign_key "backgrounds", "users"
  add_foreign_key "campaign_factions", "campaigns"
  add_foreign_key "campaign_fronts", "campaign_factions", column: "faction_id", on_delete: :nullify
  add_foreign_key "campaign_fronts", "campaign_npcs", column: "npc_id", on_delete: :nullify
  add_foreign_key "campaign_fronts", "campaigns"
  add_foreign_key "campaign_locations", "campaign_locations", column: "parent_id", on_delete: :nullify
  add_foreign_key "campaign_locations", "campaigns"
  add_foreign_key "campaign_locations", "foundry_maps", on_delete: :nullify
  add_foreign_key "campaign_npcs", "campaign_factions", column: "faction_id", on_delete: :nullify
  add_foreign_key "campaign_npcs", "campaign_references", column: "stat_block_reference_id", on_delete: :nullify
  add_foreign_key "campaign_npcs", "campaigns"
  add_foreign_key "campaign_npcs", "monsters", on_delete: :nullify
  add_foreign_key "campaign_party_members", "campaigns", on_delete: :cascade
  add_foreign_key "campaign_party_members", "player_characters", on_delete: :cascade
  add_foreign_key "campaign_quest_links", "campaign_quests", column: "quest_id", on_delete: :cascade
  add_foreign_key "campaign_quests", "campaign_locations", column: "location_id", on_delete: :nullify
  add_foreign_key "campaign_quests", "campaign_npcs", column: "giver_npc_id", on_delete: :nullify
  add_foreign_key "campaign_quests", "campaign_quests", column: "parent_id", on_delete: :nullify
  add_foreign_key "campaign_quests", "campaigns"
  add_foreign_key "campaign_references", "campaigns"
  add_foreign_key "campaign_secrets", "campaign_sessions", column: "revealed_session_id", on_delete: :nullify
  add_foreign_key "campaign_secrets", "campaigns"
  add_foreign_key "campaign_session_links", "campaign_sessions", column: "session_id", on_delete: :cascade
  add_foreign_key "campaign_sessions", "campaigns"
  add_foreign_key "campaign_tombstones", "campaigns", on_delete: :cascade
  add_foreign_key "campaigns", "users"
  add_foreign_key "class_features", "dnd_class_levels"
  add_foreign_key "class_level_choices", "class_features"
  add_foreign_key "class_specific_spell_slots", "class_specifics"
  add_foreign_key "class_specifics", "dnd_class_levels"
  add_foreign_key "class_spellcastings", "dnd_class_levels"
  add_foreign_key "compendium_entries", "users"
  add_foreign_key "content_items", "items"
  add_foreign_key "costs", "items"
  add_foreign_key "damages", "items"
  add_foreign_key "dnd_class_levels", "dnd_classes"
  add_foreign_key "dnd_classes", "users"
  add_foreign_key "feats", "users"
  add_foreign_key "foundry_map_files", "foundry_maps"
  add_foreign_key "foundry_map_taggings", "foundry_map_tags"
  add_foreign_key "foundry_map_taggings", "foundry_maps"
  add_foreign_key "foundry_scenes", "users"
  add_foreign_key "item_ranges", "items"
  add_foreign_key "item_throw_ranges", "items"
  add_foreign_key "items", "users"
  add_foreign_key "monsters", "users"
  add_foreign_key "multi_classing_prereq_options", "multi_classings"
  add_foreign_key "multi_classing_profs", "multi_classings"
  add_foreign_key "multi_classing_profs", "profs"
  add_foreign_key "multi_classings", "dnd_classes"
  add_foreign_key "patreon_users", "users", column: "linked_user_id"
  add_foreign_key "player_characters", "users"
  add_foreign_key "prerequisites", "class_features"
  add_foreign_key "race_traits", "races"
  add_foreign_key "races", "users"
  add_foreign_key "senses", "monsters"
  add_foreign_key "speeds", "monsters"
  add_foreign_key "spell_casting_abilities", "ability_scores"
  add_foreign_key "spell_casting_abilities", "spell_castings"
  add_foreign_key "spell_casting_infos", "spell_castings"
  add_foreign_key "spell_castings", "dnd_classes"
  add_foreign_key "spells", "users"
  add_foreign_key "starting_equipment_options", "dnd_classes"
  add_foreign_key "starting_equipment_options", "starting_equipment_options", column: "equipment_option_id"
  add_foreign_key "two_handed_damages", "items"
end
