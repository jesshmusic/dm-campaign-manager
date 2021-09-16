class CreateClassSpecifics < ActiveRecord::Migration[6.1]
  def change
    create_table :class_specifics do |t|
      t.references :dnd_class_level, null: false, foreign_key: true
      t.integer :action_surges
      t.integer :arcane_recovery_levels
      t.integer :aura_range
      t.integer :bardic_inspiration_die
      t.integer :brutal_critical_dice
      t.integer :channel_divinity_charges
      t.integer :destroy_undead_cr
      t.integer :extra_attacks
      t.integer :favored_enemies
      t.integer :favored_terrain
      t.integer :indomitable_uses
      t.integer :invocations_known
      t.integer :ki_points
      t.integer :magical_secrets_max_5
      t.integer :magical_secrets_max_7
      t.integer :magical_secrets_max_9
      t.integer :metamagic_known
      t.integer :mystic_arcanum_level_6
      t.integer :mystic_arcanum_level_7
      t.integer :mystic_arcanum_level_8
      t.integer :mystic_arcanum_level_9
      t.integer :rage_count
      t.integer :rage_damage_bonus
      t.integer :song_of_rest_die
      t.integer :sorcery_points
      t.integer :unarmored_movement
      t.boolean :wild_shape_fly
      t.boolean :wild_shape_max_cr
      t.boolean :wild_shape_swim

      t.timestamps
    end
  end
end
