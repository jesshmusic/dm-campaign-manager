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

ActiveRecord::Schema.define(version: 2021_09_06_015607) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "condition_immunities", force: :cascade do |t|
    t.bigint "monster_id"
    t.bigint "condition_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["condition_id"], name: "index_condition_immunities_on_condition_id"
    t.index ["monster_id"], name: "index_condition_immunities_on_monster_id"
  end

  create_table "conditions", force: :cascade do |t|
    t.string "index"
    t.string "name"
    t.string "description", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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

  create_table "items", force: :cascade do |t|
    t.string "name"
    t.integer "str_minimum"
    t.boolean "stealth_disadvantage"
    t.string "weapon_range"
    t.string "category_range"
    t.integer "weight"
    t.string "api_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.string "slug"
    t.string "rarity"
    t.string "requires_attunement"
    t.string "type"
    t.integer "armor_class_bonus"
    t.string "armor_category"
    t.jsonb "armor_class"
    t.string "capacity"
    t.jsonb "cost"
    t.jsonb "contents", default: [], array: true
    t.jsonb "damage"
    t.string "desc", default: [], array: true
    t.string "equipment_category"
    t.string "gear_category"
    t.string "properties", default: [], array: true
    t.integer "quantity"
    t.jsonb "range"
    t.string "special", default: [], array: true
    t.jsonb "speed"
    t.jsonb "throw_range"
    t.string "tool_category"
    t.jsonb "two_handed_damage"
    t.string "vehicle_category"
    t.string "weapon_category"
    t.index ["armor_category"], name: "index_items_on_armor_category"
    t.index ["category_range"], name: "index_items_on_category_range"
    t.index ["slug"], name: "index_items_on_slug", unique: true
    t.index ["tool_category"], name: "index_items_on_tool_category"
    t.index ["user_id"], name: "index_items_on_user_id"
    t.index ["vehicle_category"], name: "index_items_on_vehicle_category"
    t.index ["weapon_category"], name: "index_items_on_weapon_category"
  end

  create_table "monster_proficiencies", force: :cascade do |t|
    t.bigint "monster_id"
    t.bigint "prof_id"
    t.integer "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "legendary_description"
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
    t.string "damage_immunities", default: [], array: true
    t.string "damage_resistances", default: [], array: true
    t.string "damage_vulnerabilities", default: [], array: true
    t.jsonb "senses"
    t.jsonb "speed"
    t.jsonb "actions", default: [], array: true
    t.jsonb "legendary_actions", default: [], array: true
    t.jsonb "special_abilities", default: [], array: true
    t.jsonb "reactions", default: [], array: true
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

  create_table "profs_races", id: false, force: :cascade do |t|
    t.bigint "race_id", null: false
    t.bigint "prof_id", null: false
    t.index ["race_id", "prof_id"], name: "index_profs_races_on_race_id_and_prof_id"
  end

  create_table "races", force: :cascade do |t|
    t.string "name", default: "New Race...", null: false
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
    t.text "alignment"
    t.text "age"
    t.string "size"
    t.text "size_description"
    t.string "languages", default: [], array: true
    t.text "language_description"
    t.jsonb "traits", default: [], array: true
    t.integer "speed"
    t.integer "starting_languages"
    t.string "language_choices", default: [], array: true
    t.integer "ability_bonus_options"
    t.string "ability_bonus_option_choices", default: [], array: true
    t.string "subraces", default: [], array: true
    t.index ["name"], name: "index_races_on_name"
    t.index ["slug"], name: "index_races_on_slug"
    t.index ["user_id"], name: "index_races_on_user_id"
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

  add_foreign_key "dnd_classes", "users"
  add_foreign_key "items", "users"
  add_foreign_key "monsters", "users"
  add_foreign_key "races", "users"
  add_foreign_key "spells", "users"
end
