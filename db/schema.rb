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

ActiveRecord::Schema.define(version: 2021_09_09_155309) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "ability_score_dnd_classes", force: :cascade do |t|
    t.bigint "dnd_class_id", null: false
    t.bigint "ability_score_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ability_score_id"], name: "index_ability_score_dnd_classes_on_ability_score_id"
    t.index ["dnd_class_id"], name: "index_ability_score_dnd_classes_on_dnd_class_id"
  end

  create_table "ability_scores", force: :cascade do |t|
    t.string "desc", default: [], array: true
    t.string "full_name"
    t.string "name"
    t.string "slug"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "api_references", force: :cascade do |t|
    t.string "name"
    t.string "slug"
    t.string "api_url"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "equipment_id"
    t.index ["equipment_id"], name: "index_api_references_on_equipment_id"
  end

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

  create_table "costs", force: :cascade do |t|
    t.integer "quantity"
    t.string "unit"
    t.bigint "item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_id"], name: "index_costs_on_item_id"
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
    t.string "subclasses", default: [], array: true
    t.index ["slug"], name: "index_dnd_classes_on_slug", unique: true
    t.index ["user_id"], name: "index_dnd_classes_on_user_id"
  end

  create_table "equipment", force: :cascade do |t|
    t.integer "quantity"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "starting_equipment_option_id"
    t.bigint "dnd_class_id"
    t.index ["dnd_class_id"], name: "index_equipment_on_dnd_class_id"
    t.index ["starting_equipment_option_id"], name: "index_equipment_on_starting_equipment_option_id"
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
    t.string "magic_item_type"
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

  create_table "multi_class_prereqs", force: :cascade do |t|
    t.string "ability_score"
    t.integer "minimum_score"
    t.bigint "multi_classing_id"
    t.bigint "multi_classing_prereq_option_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["multi_classing_id"], name: "index_multi_class_prereqs_on_multi_classing_id"
    t.index ["multi_classing_prereq_option_id"], name: "index_multi_class_prereqs_on_multi_classing_prereq_option_id"
  end

  create_table "multi_classing_prereq_options", force: :cascade do |t|
    t.bigint "multi_classing_id", null: false
    t.integer "choose"
    t.string "type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["multi_classing_id"], name: "index_multi_classing_prereq_options_on_multi_classing_id"
  end

  create_table "multi_classing_profs", force: :cascade do |t|
    t.bigint "prof_id", null: false
    t.bigint "multi_classing_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["multi_classing_id"], name: "index_multi_classing_profs_on_multi_classing_id"
    t.index ["prof_id"], name: "index_multi_classing_profs_on_prof_id"
  end

  create_table "multi_classings", force: :cascade do |t|
    t.bigint "dnd_class_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dnd_class_id"], name: "index_multi_classings_on_dnd_class_id"
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
    t.bigint "multi_classing_id"
    t.index ["dnd_class_id"], name: "index_prof_choices_on_dnd_class_id"
    t.index ["multi_classing_id"], name: "index_prof_choices_on_multi_classing_id"
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

  create_table "spell_casting_abilities", force: :cascade do |t|
    t.bigint "spell_casting_id", null: false
    t.bigint "ability_score_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["ability_score_id"], name: "index_spell_casting_abilities_on_ability_score_id"
    t.index ["spell_casting_id"], name: "index_spell_casting_abilities_on_spell_casting_id"
  end

  create_table "spell_casting_infos", force: :cascade do |t|
    t.string "name"
    t.bigint "spell_casting_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "desc", default: [], array: true
    t.index ["spell_casting_id"], name: "index_spell_casting_infos_on_spell_casting_id"
  end

  create_table "spell_castings", force: :cascade do |t|
    t.integer "level"
    t.bigint "dnd_class_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dnd_class_id"], name: "index_spell_castings_on_dnd_class_id"
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

  create_table "starting_equipment_options", force: :cascade do |t|
    t.integer "choose"
    t.string "equipment_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "dnd_class_id"
    t.bigint "equipment_option_id"
    t.string "equipment_category"
    t.index ["dnd_class_id"], name: "index_starting_equipment_options_on_dnd_class_id"
    t.index ["equipment_option_id"], name: "index_starting_equipment_options_on_equipment_option_id"
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

  add_foreign_key "ability_score_dnd_classes", "ability_scores"
  add_foreign_key "ability_score_dnd_classes", "dnd_classes"
  add_foreign_key "costs", "items"
  add_foreign_key "dnd_classes", "users"
  add_foreign_key "items", "users"
  add_foreign_key "monsters", "users"
  add_foreign_key "multi_classing_prereq_options", "multi_classings"
  add_foreign_key "multi_classing_profs", "multi_classings"
  add_foreign_key "multi_classing_profs", "profs"
  add_foreign_key "multi_classings", "dnd_classes"
  add_foreign_key "races", "users"
  add_foreign_key "spell_casting_abilities", "ability_scores"
  add_foreign_key "spell_casting_abilities", "spell_castings"
  add_foreign_key "spell_casting_infos", "spell_castings"
  add_foreign_key "spell_castings", "dnd_classes"
  add_foreign_key "spells", "users"
  add_foreign_key "starting_equipment_options", "dnd_classes"
  add_foreign_key "starting_equipment_options", "starting_equipment_options", column: "equipment_option_id"
end
