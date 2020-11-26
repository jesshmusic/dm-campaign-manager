class DropOldTables < ActiveRecord::Migration[6.0]
  def up
    drop_table :adventure_world_locations, force: :cascade
    drop_table :adventures, force: :cascade
    drop_table :campaigns, force: :cascade
    drop_table :character_actions, force: :cascade
    drop_table :character_adventures, force: :cascade
    drop_table :character_classes, force: :cascade
    drop_table :character_items, force: :cascade
    drop_table :character_spells, force: :cascade
    drop_table :character_world_locations, force: :cascade
    drop_table :characters, force: :cascade
    drop_table :encounter_combatants, force: :cascade
    drop_table :encounter_items, force: :cascade
    drop_table :encounter_monsters, force: :cascade
    drop_table :encounter_npcs, force: :cascade
    drop_table :encounters, force: :cascade
    drop_table :guilds, force: :cascade
    drop_table :world_events, force: :cascade
    drop_table :world_locations, force: :cascade
  end

  def down
    fail ActiveRecord::IrreversibleMigration
  end
end
