# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_10_16_160720) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "adventure_world_locations", force: :cascade do |t|
    t.bigint "adventure_id"
    t.bigint "world_location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["adventure_id"], name: "index_adventure_world_locations_on_adventure_id"
    t.index ["world_location_id"], name: "index_adventure_world_locations_on_world_location_id"
  end

  create_table "adventures", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.bigint "campaign_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "sort", default: 0, null: false
    t.index ["campaign_id"], name: "index_adventures_on_campaign_id"
  end

  create_table "campaigns", force: :cascade do |t|
    t.bigint "user_id"
    t.string "name"
    t.text "description"
    t.string "world"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["slug"], name: "index_campaigns_on_slug", unique: true
    t.index ["user_id"], name: "index_campaigns_on_user_id"
  end

  create_table "character_actions", force: :cascade do |t|
    t.string "name", default: "New Action"
    t.text "description", default: ""
    t.integer "attack_bonus"
    t.integer "damage_bonus"
    t.string "damage_dice"
    t.bigint "character_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_character_actions_on_character_id"
  end

  create_table "character_adventures", force: :cascade do |t|
    t.bigint "adventure_id"
    t.bigint "character_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["adventure_id"], name: "index_character_adventures_on_adventure_id"
    t.index ["character_id"], name: "index_character_adventures_on_character_id"
  end

  create_table "character_classes", force: :cascade do |t|
    t.bigint "character_id"
    t.bigint "dnd_class_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "level", default: 1
    t.integer "proficiency_bonus", default: 2
    t.integer "spell_attack_bonus", default: 2
    t.integer "spell_save_dc", default: 8
    t.index ["character_id"], name: "index_character_classes_on_character_id"
    t.index ["dnd_class_id"], name: "index_character_classes_on_dnd_class_id"
  end

  create_table "character_items", force: :cascade do |t|
    t.integer "quantity", default: 1, null: false
    t.boolean "equipped", default: false, null: false
    t.boolean "carrying", default: true, null: false
    t.bigint "item_id"
    t.bigint "character_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_character_items_on_character_id"
    t.index ["item_id"], name: "index_character_items_on_item_id"
  end

  create_table "character_spells", force: :cascade do |t|
    t.bigint "spell_id"
    t.bigint "character_id"
    t.boolean "is_prepared", default: false, null: false
    t.string "spell_class"
    t.index ["character_id"], name: "index_character_spells_on_character_id"
    t.index ["spell_id"], name: "index_character_spells_on_spell_id"
  end

  create_table "character_world_locations", force: :cascade do |t|
    t.bigint "character_id"
    t.bigint "world_location_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_character_world_locations_on_character_id"
    t.index ["world_location_id"], name: "index_character_world_locations_on_world_location_id"
  end

  create_table "characters", force: :cascade do |t|
    t.string "name", null: false
    t.text "description", default: "Enter this character's backstory, history, or notes here."
    t.string "slug", null: false
    t.string "role", default: "Player Character"
    t.integer "xp", default: 0, null: false
    t.string "alignment", default: "neutral"
    t.string "languages", default: "Common"
    t.integer "copper_pieces", default: 0
    t.integer "silver_pieces", default: 0, null: false
    t.integer "electrum_pieces", default: 0
    t.integer "gold_pieces", default: 0
    t.integer "platinum_pieces", default: 0
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "background", default: "Acolyte"
    t.string "type"
    t.integer "proficiency", default: 2
    t.integer "armor_class", default: 10, null: false
    t.integer "charisma", default: 10, null: false
    t.integer "constitution", default: 10, null: false
    t.integer "dexterity", default: 10, null: false
    t.integer "hit_points", default: 8, null: false
    t.integer "hit_points_current", default: 8, null: false
    t.integer "initiative", default: 0, null: false
    t.integer "intelligence", default: 10, null: false
    t.string "speed", default: "30 feet", null: false
    t.integer "strength", default: 10, null: false
    t.integer "wisdom", default: 10, null: false
    t.integer "race_id", default: 1, null: false
    t.integer "armor_id"
    t.integer "shield_id"
    t.integer "weapon_lh_id"
    t.integer "weapon_rh_id"
    t.integer "weapon_2h_id"
    t.integer "armor_class_modifier", default: 0, null: false
    t.integer "status", default: 0, null: false
    t.bigint "guild_id"
    t.bigint "campaign_id"
    t.index ["campaign_id"], name: "index_characters_on_campaign_id"
    t.index ["guild_id"], name: "index_characters_on_guild_id"
    t.index ["slug"], name: "index_characters_on_slug"
  end

  create_table "container_items", force: :cascade do |t|
    t.bigint "item_id"
    t.bigint "contained_item_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["contained_item_id"], name: "index_container_items_on_contained_item_id"
    t.index ["item_id", "contained_item_id"], name: "index_container_items_on_item_id_and_contained_item_id", unique: true
    t.index ["item_id"], name: "index_container_items_on_item_id"
  end

  create_table "dnd_classes", force: :cascade do |t|
    t.string "name"
    t.integer "hit_die"
    t.string "api_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.string "slug"
    t.string "spell_ability"
    t.string "primary_abilities", default: [], array: true
    t.string "saving_throw_abilities", default: [], array: true
    t.index ["slug"], name: "index_dnd_classes_on_slug", unique: true
    t.index ["user_id"], name: "index_dnd_classes_on_user_id"
  end

  create_table "encounter_combatants", force: :cascade do |t|
    t.bigint "encounter_id"
    t.bigint "character_id"
    t.bigint "monster_id"
    t.integer "current_hit_points", default: 0
    t.integer "initiative_roll", default: 0
    t.integer "combat_order_number", default: 0
    t.text "notes", default: ""
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.index ["character_id"], name: "index_encounter_combatants_on_character_id"
    t.index ["encounter_id"], name: "index_encounter_combatants_on_encounter_id"
    t.index ["monster_id"], name: "index_encounter_combatants_on_monster_id"
  end

  create_table "encounter_items", force: :cascade do |t|
    t.integer "quantity", default: 1, null: false
    t.bigint "encounter_id"
    t.bigint "item_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["encounter_id"], name: "index_encounter_items_on_encounter_id"
    t.index ["item_id"], name: "index_encounter_items_on_item_id"
  end

  create_table "encounter_monsters", force: :cascade do |t|
    t.bigint "monster_id"
    t.bigint "encounter_id"
    t.integer "number_of_monsters", default: 1
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["encounter_id"], name: "index_encounter_monsters_on_encounter_id"
    t.index ["monster_id"], name: "index_encounter_monsters_on_monster_id"
  end

  create_table "encounter_npcs", force: :cascade do |t|
    t.bigint "character_id"
    t.bigint "encounter_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_combatant", default: false, null: false
    t.index ["character_id"], name: "index_encounter_npcs_on_character_id"
    t.index ["encounter_id"], name: "index_encounter_npcs_on_encounter_id"
  end

  create_table "encounters", force: :cascade do |t|
    t.string "name", default: "New Encounter"
    t.text "description"
    t.integer "platinum_pieces", default: 0
    t.integer "gold_pieces", default: 0
    t.integer "electrum_pieces", default: 0
    t.integer "silver_pieces", default: 0
    t.integer "copper_pieces", default: 0
    t.integer "xp", default: 0
    t.bigint "adventure_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "location", default: "New Location", null: false
    t.integer "sort", default: 0, null: false
    t.integer "round", default: 1
    t.integer "current_mob_index", default: 0
    t.boolean "in_progress", default: false
    t.index ["adventure_id"], name: "index_encounters_on_adventure_id"
  end

  create_table "guilds", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.string "slug"
    t.bigint "campaign_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_guilds_on_campaign_id"
    t.index ["slug"], name: "index_guilds_on_slug"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.string "sub_category"
    t.integer "armor_class"
    t.boolean "armor_dex_bonus"
    t.integer "armor_max_bonus"
    t.integer "armor_str_minimum"
    t.boolean "armor_stealth_disadvantage"
    t.string "weapon_range"
    t.integer "weapon_damage_dice_count"
    t.integer "weapon_damage_dice_value"
    t.string "weapon_damage_type"
    t.integer "weapon_range_normal"
    t.integer "weapon_range_long"
    t.string "weapon_properties", default: [], array: true
    t.integer "weapon_thrown_range_normal"
    t.integer "weapon_thrown_range_long"
    t.integer "weapon_2h_damage_dice_count"
    t.integer "weapon_2h_damage_dice_value"
    t.string "weapon_2h_damage_type"
    t.string "category_range"
    t.text "description"
    t.integer "weight"
    t.integer "cost_value"
    t.string "cost_unit"
    t.string "api_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "vehicle_speed"
    t.string "vehicle_speed_unit"
    t.string "vehicle_capacity"
    t.bigint "user_id"
    t.string "slug"
    t.string "rarity"
    t.string "requires_attunement"
    t.string "type"
    t.integer "weapon_attack_bonus"
    t.integer "weapon_damage_bonus"
    t.integer "armor_class_bonus"
    t.index ["slug"], name: "index_items_on_slug", unique: true
    t.index ["user_id"], name: "index_items_on_user_id"
  end

  create_table "monster_actions", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "attack_bonus"
    t.integer "damage_bonus"
    t.string "damage_dice"
    t.bigint "monster_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["monster_id"], name: "index_monster_actions_on_monster_id"
  end

  create_table "monster_legendary_actions", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "attack_bonus"
    t.integer "damage_bonus"
    t.string "damage_dice"
    t.bigint "monster_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["monster_id"], name: "index_monster_legendary_actions_on_monster_id"
  end

  create_table "monster_special_abilities", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.integer "attack_bonus"
    t.integer "damage_bonus"
    t.string "damage_dice"
    t.bigint "monster_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["monster_id"], name: "index_monster_special_abilities_on_monster_id"
  end

  create_table "monsters", force: :cascade do |t|
    t.string "name"
    t.string "size"
    t.string "monster_type"
    t.string "monster_subtype"
    t.string "alignment"
    t.integer "strength_save"
    t.integer "dexterity_save"
    t.integer "constitution_save"
    t.integer "intelligence_save"
    t.integer "wisdom_save"
    t.integer "charisma_save"
    t.string "damage_vulnerabilities"
    t.string "damage_resistances"
    t.string "damage_immunities"
    t.string "condition_immunities"
    t.string "senses"
    t.string "languages"
    t.string "challenge_rating"
    t.string "api_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "legendary_description"
    t.text "reactions"
    t.bigint "user_id"
    t.string "slug"
    t.integer "armor_class", default: 10
    t.integer "charisma", default: 10, null: false
    t.integer "constitution", default: 10, null: false
    t.integer "dexterity", default: 10, null: false
    t.integer "hit_dice_modifier", default: 0
    t.integer "hit_dice_number", default: 1, null: false
    t.integer "hit_dice_value", default: 8, null: false
    t.integer "hit_points", default: 8, null: false
    t.integer "initiative", default: 0, null: false
    t.integer "intelligence", default: 10, null: false
    t.string "speed", default: "30 feet", null: false
    t.integer "strength", default: 10, null: false
    t.integer "wisdom", default: 10, null: false
    t.index ["slug"], name: "index_monsters_on_slug", unique: true
    t.index ["user_id"], name: "index_monsters_on_user_id"
  end

  create_table "prof_choice_profs", force: :cascade do |t|
    t.bigint "prof_id"
    t.bigint "prof_choice_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["prof_choice_id"], name: "index_prof_choice_profs_on_prof_choice_id"
    t.index ["prof_id"], name: "index_prof_choice_profs_on_prof_id"
  end

  create_table "prof_choices", force: :cascade do |t|
    t.integer "num_choices"
    t.string "prof_choice_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name"
    t.bigint "dnd_class_id"
    t.index ["dnd_class_id"], name: "index_prof_choices_on_dnd_class_id"
  end

  create_table "prof_classes", force: :cascade do |t|
    t.bigint "prof_id"
    t.bigint "dnd_class_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["dnd_class_id"], name: "index_prof_classes_on_dnd_class_id"
    t.index ["prof_id"], name: "index_prof_classes_on_prof_id"
  end

  create_table "profs", force: :cascade do |t|
    t.string "name"
    t.string "prof_type"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_profs_on_name", unique: true
  end

  create_table "races", force: :cascade do |t|
    t.string "name", default: "New Race...", null: false
    t.string "speed", default: "30 feet", null: false
    t.integer "strength_modifier", default: 0, null: false
    t.integer "dexterity_modifier", default: 0, null: false
    t.integer "constitution_modifier", default: 0, null: false
    t.integer "intelligence_modifier", default: 0, null: false
    t.integer "wisdom_modifier", default: 0, null: false
    t.integer "charisma_modifier", default: 0, null: false
    t.string "slug", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.index ["name"], name: "index_races_on_name"
    t.index ["slug"], name: "index_races_on_slug"
    t.index ["user_id"], name: "index_races_on_user_id"
  end

  create_table "skills", force: :cascade do |t|
    t.string "name"
    t.integer "score"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "monster_id"
    t.bigint "character_id"
    t.index ["character_id"], name: "index_skills_on_character_id"
    t.index ["monster_id"], name: "index_skills_on_monster_id"
  end

  create_table "spell_classes", force: :cascade do |t|
    t.bigint "spell_id"
    t.bigint "dnd_class_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "school"
    t.string "api_url"
    t.string "spell_level"
    t.bigint "user_id"
    t.string "slug"
    t.index ["slug"], name: "index_spells_on_slug", unique: true
    t.index ["user_id"], name: "index_spells_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "role"
    t.string "name"
    t.string "username"
    t.string "slug"
    t.datetime "deleted_at"
    t.string "location"
    t.text "info"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_users_on_slug", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "world_events", force: :cascade do |t|
    t.text "description"
    t.bigint "campaign_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "when"
    t.index ["campaign_id"], name: "index_world_events_on_campaign_id"
  end

  create_table "world_locations", force: :cascade do |t|
    t.text "description"
    t.integer "map_x", default: 0
    t.integer "map_y", default: 0
    t.bigint "campaign_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "name", default: "", null: false
    t.index ["campaign_id"], name: "index_world_locations_on_campaign_id"
  end

  add_foreign_key "adventure_world_locations", "adventures"
  add_foreign_key "adventure_world_locations", "world_locations"
  add_foreign_key "adventures", "campaigns"
  add_foreign_key "character_adventures", "adventures"
  add_foreign_key "character_adventures", "characters"
  add_foreign_key "character_classes", "characters"
  add_foreign_key "character_classes", "dnd_classes"
  add_foreign_key "character_items", "characters"
  add_foreign_key "character_items", "items"
  add_foreign_key "character_world_locations", "characters"
  add_foreign_key "character_world_locations", "world_locations"
  add_foreign_key "characters", "campaigns"
  add_foreign_key "container_items", "items"
  add_foreign_key "container_items", "items", column: "contained_item_id"
  add_foreign_key "dnd_classes", "users"
  add_foreign_key "encounter_combatants", "characters"
  add_foreign_key "encounter_combatants", "encounters"
  add_foreign_key "encounter_combatants", "monsters"
  add_foreign_key "encounter_items", "encounters"
  add_foreign_key "encounter_items", "items"
  add_foreign_key "encounter_monsters", "encounters"
  add_foreign_key "encounter_monsters", "monsters"
  add_foreign_key "encounter_npcs", "characters"
  add_foreign_key "encounter_npcs", "encounters"
  add_foreign_key "encounters", "adventures"
  add_foreign_key "guilds", "campaigns"
  add_foreign_key "items", "users"
  add_foreign_key "monsters", "users"
  add_foreign_key "races", "users"
  add_foreign_key "spells", "users"
  add_foreign_key "world_events", "campaigns"
  add_foreign_key "world_locations", "campaigns"
end
