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

ActiveRecord::Schema.define(version: 2019_08_13_011007) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "campaign_characters", force: :cascade do |t|
    t.bigint "campaign_id"
    t.bigint "character_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_campaign_characters_on_campaign_id"
    t.index ["character_id"], name: "index_campaign_characters_on_character_id"
  end

  create_table "campaign_users", force: :cascade do |t|
    t.bigint "campaign_id"
    t.bigint "user_id"
    t.boolean "confirmed"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["campaign_id"], name: "index_campaign_users_on_campaign_id"
    t.index ["user_id"], name: "index_campaign_users_on_user_id"
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

  create_table "character_classes", force: :cascade do |t|
    t.bigint "character_id"
    t.bigint "dnd_class_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["character_id"], name: "index_character_classes_on_character_id"
    t.index ["dnd_class_id"], name: "index_character_classes_on_dnd_class_id"
  end

  create_table "character_magic_items", force: :cascade do |t|
    t.bigint "magic_item_id"
    t.bigint "character_id"
    t.index ["character_id"], name: "index_character_magic_items_on_character_id"
    t.index ["magic_item_id"], name: "index_character_magic_items_on_magic_item_id"
  end

  create_table "character_spells", force: :cascade do |t|
    t.bigint "spell_id"
    t.bigint "character_id"
    t.boolean "is_prepared", default: false, null: false
    t.index ["character_id"], name: "index_character_spells_on_character_id"
    t.index ["spell_id"], name: "index_character_spells_on_spell_id"
  end

  create_table "characters", force: :cascade do |t|
    t.string "character_type", default: "pc", null: false
    t.string "name", null: false
    t.text "description", default: "Enter this character's backstory, history, or notes here."
    t.string "slug", null: false
    t.string "role", default: "Player Character"
    t.integer "level", default: 1, null: false
    t.integer "xp", default: 0, null: false
    t.string "alignment", default: "neutral"
    t.string "race", default: "Human", null: false
    t.string "languages", default: "Common"
    t.string "spell_ability", default: "Intelligence"
    t.integer "spell_save_dc", default: 8
    t.integer "spell_attack_bonus", default: 0
    t.integer "copper_pieces", default: 0
    t.integer "silver_pieces", default: 0, null: false
    t.integer "electrum_pieces", default: 0
    t.integer "gold_pieces", default: 0
    t.integer "platinum_pieces", default: 0
    t.bigint "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "background", default: "Acolyte"
    t.index ["slug"], name: "index_characters_on_slug"
    t.index ["user_id"], name: "index_characters_on_user_id"
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
    t.index ["slug"], name: "index_dnd_classes_on_slug", unique: true
    t.index ["user_id"], name: "index_dnd_classes_on_user_id"
  end

  create_table "equipment_item_items", force: :cascade do |t|
    t.bigint "item_id"
    t.bigint "equipment_item_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["equipment_item_id"], name: "index_equipment_item_items_on_equipment_item_id"
    t.index ["item_id"], name: "index_equipment_item_items_on_item_id"
  end

  create_table "equipment_items", force: :cascade do |t|
    t.integer "quantity"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "character_id"
    t.index ["character_id"], name: "index_equipment_items_on_character_id"
  end

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.string "category"
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
    t.index ["slug"], name: "index_items_on_slug", unique: true
    t.index ["user_id"], name: "index_items_on_user_id"
  end

  create_table "magic_items", force: :cascade do |t|
    t.string "name"
    t.string "magic_item_type"
    t.text "description"
    t.string "rarity"
    t.string "requires_attunement"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.string "slug"
    t.index ["slug"], name: "index_magic_items_on_slug", unique: true
    t.index ["user_id"], name: "index_magic_items_on_user_id"
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

  create_table "stat_blocks", force: :cascade do |t|
    t.bigint "character_id"
    t.bigint "monster_id"
    t.integer "armor_class", default: 10
    t.integer "charisma", default: 10, null: false
    t.integer "constitution", default: 10, null: false
    t.integer "dexterity", default: 10, null: false
    t.integer "hit_dice_number", default: 1, null: false
    t.integer "hit_dice_value", default: 8, null: false
    t.integer "hit_points", default: 8, null: false
    t.integer "hit_points_current", default: 8, null: false
    t.integer "initiative", default: 0, null: false
    t.integer "intelligence", default: 10, null: false
    t.integer "proficiency", default: 2, null: false
    t.string "speed", default: "30 feet", null: false
    t.integer "strength", default: 10, null: false
    t.integer "wisdom", default: 10, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "hit_dice_modifier", default: 0
    t.index ["character_id"], name: "index_stat_blocks_on_character_id"
    t.index ["monster_id"], name: "index_stat_blocks_on_monster_id"
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["slug"], name: "index_users_on_slug", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "campaign_characters", "campaigns"
  add_foreign_key "campaign_characters", "characters"
  add_foreign_key "campaign_users", "campaigns"
  add_foreign_key "campaign_users", "users"
  add_foreign_key "character_classes", "characters"
  add_foreign_key "character_classes", "dnd_classes"
  add_foreign_key "container_items", "items"
  add_foreign_key "container_items", "items", column: "contained_item_id"
  add_foreign_key "dnd_classes", "users"
  add_foreign_key "items", "users"
  add_foreign_key "magic_items", "users"
  add_foreign_key "monsters", "users"
  add_foreign_key "spells", "users"
end
