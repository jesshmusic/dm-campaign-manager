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

ActiveRecord::Schema.define(version: 2021_10_19_144112) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "ability_bonus_options", force: :cascade do |t|
    t.string "ability"
    t.integer "bonus"
    t.bigint "race_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["race_id"], name: "index_ability_bonus_options_on_race_id"
  end

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

  create_table "actions", force: :cascade do |t|
    t.string "desc"
    t.string "name"
    t.bigint "monster_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "type"
    t.index ["monster_id"], name: "index_actions_on_monster_id"
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

  create_table "armor_classes", force: :cascade do |t|
    t.integer "ac_base"
    t.boolean "has_dex_bonus"
    t.integer "max_dex_bonus"
    t.bigint "item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_id"], name: "index_armor_classes_on_item_id"
  end

  create_table "class_features", force: :cascade do |t|
    t.integer "level"
    t.string "name"
    t.string "reference"
    t.bigint "dnd_class_level_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "desc", default: [], array: true
    t.index ["dnd_class_level_id"], name: "index_class_features_on_dnd_class_level_id"
  end

  create_table "class_level_choices", force: :cascade do |t|
    t.bigint "class_feature_id", null: false
    t.integer "num_choices"
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "choices", default: [], array: true
    t.index ["class_feature_id"], name: "index_class_level_choices_on_class_feature_id"
  end

  create_table "class_specific_spell_slots", force: :cascade do |t|
    t.integer "sorcery_point_cost"
    t.integer "spell_slot_level"
    t.bigint "class_specific_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["class_specific_id"], name: "index_class_specific_spell_slots_on_class_specific_id"
  end

  create_table "class_specifics", force: :cascade do |t|
    t.bigint "dnd_class_level_id", null: false
    t.string "name"
    t.string "index"
    t.string "value"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dnd_class_level_id"], name: "index_class_spellcastings_on_dnd_class_level_id"
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

  create_table "content_items", force: :cascade do |t|
    t.bigint "item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "name", null: false
    t.string "index", null: false
    t.integer "quantity", default: 1
    t.index ["item_id"], name: "index_content_items_on_item_id"
  end

  create_table "costs", force: :cascade do |t|
    t.integer "quantity"
    t.string "unit"
    t.bigint "item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_id"], name: "index_costs_on_item_id"
  end

  create_table "damage_immunities", force: :cascade do |t|
    t.string "name"
    t.bigint "monster_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["monster_id"], name: "index_damage_immunities_on_monster_id"
  end

  create_table "damage_resistances", force: :cascade do |t|
    t.string "name"
    t.bigint "monster_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["monster_id"], name: "index_damage_resistances_on_monster_id"
  end

  create_table "damage_vulnerabilities", force: :cascade do |t|
    t.string "name"
    t.bigint "monster_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["monster_id"], name: "index_damage_vulnerabilities_on_monster_id"
  end

  create_table "damages", force: :cascade do |t|
    t.string "damage_type"
    t.string "damage_dice"
    t.bigint "item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_id"], name: "index_damages_on_item_id"
  end

  create_table "dnd_class_levels", force: :cascade do |t|
    t.integer "ability_score_bonuses"
    t.bigint "dnd_class_id", null: false
    t.integer "level"
    t.integer "prof_bonus"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["dnd_class_id"], name: "index_dnd_class_levels_on_dnd_class_id"
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

  create_table "item_ranges", force: :cascade do |t|
    t.integer "long"
    t.integer "normal"
    t.bigint "item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_id"], name: "index_item_ranges_on_item_id"
  end

  create_table "item_throw_ranges", force: :cascade do |t|
    t.integer "long"
    t.integer "normal"
    t.bigint "item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.string "prereq_type"
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

  create_table "prerequisites", force: :cascade do |t|
    t.string "name"
    t.integer "level"
    t.bigint "class_feature_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["class_feature_id"], name: "index_prerequisites_on_class_feature_id"
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

  create_table "race_traits", force: :cascade do |t|
    t.string "name"
    t.string "desc", default: [], array: true
    t.bigint "race_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["race_id"], name: "index_race_traits_on_race_id"
  end

  create_table "races", force: :cascade do |t|
    t.string "name", default: "New Race...", null: false
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

  create_table "sections", force: :cascade do |t|
    t.string "name"
    t.string "description"
    t.string "slug"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "senses", force: :cascade do |t|
    t.string "name"
    t.bigint "monster_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "value"
    t.index ["monster_id"], name: "index_senses_on_monster_id"
  end

  create_table "speeds", force: :cascade do |t|
    t.integer "value"
    t.string "name"
    t.bigint "monster_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["monster_id"], name: "index_speeds_on_monster_id"
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

  create_table "two_handed_damages", force: :cascade do |t|
    t.string "damage_type"
    t.string "damage_dice"
    t.bigint "item_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["item_id"], name: "index_two_handed_damages_on_item_id"
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
    t.datetime "deleted_at"
    t.string "location"
    t.text "info"
    t.string "provider", default: "", null: false
    t.string "uid", default: "", null: false
    t.string "auth_id", default: "", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "ability_bonus_options", "races"
  add_foreign_key "ability_score_dnd_classes", "ability_scores"
  add_foreign_key "ability_score_dnd_classes", "dnd_classes"
  add_foreign_key "actions", "monsters"
  add_foreign_key "armor_classes", "items"
  add_foreign_key "class_features", "dnd_class_levels"
  add_foreign_key "class_level_choices", "class_features"
  add_foreign_key "class_specific_spell_slots", "class_specifics"
  add_foreign_key "class_specifics", "dnd_class_levels"
  add_foreign_key "class_spellcastings", "dnd_class_levels"
  add_foreign_key "content_items", "items"
  add_foreign_key "costs", "items"
  add_foreign_key "damage_immunities", "monsters"
  add_foreign_key "damage_resistances", "monsters"
  add_foreign_key "damage_vulnerabilities", "monsters"
  add_foreign_key "damages", "items"
  add_foreign_key "dnd_class_levels", "dnd_classes"
  add_foreign_key "dnd_classes", "users"
  add_foreign_key "item_ranges", "items"
  add_foreign_key "item_throw_ranges", "items"
  add_foreign_key "items", "users"
  add_foreign_key "monsters", "users"
  add_foreign_key "multi_classing_prereq_options", "multi_classings"
  add_foreign_key "multi_classing_profs", "multi_classings"
  add_foreign_key "multi_classing_profs", "profs"
  add_foreign_key "multi_classings", "dnd_classes"
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
