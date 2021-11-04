MIGRATION_CLASS =
  if ActiveRecord::VERSION::MAJOR >= 5
    ActiveRecord::Migration["#{ActiveRecord::VERSION::MAJOR}.#{ActiveRecord::VERSION::MINOR}"]
  else
    ActiveRecord::Migration
  end

class CreateFriendlyIdSlugs < MIGRATION_CLASS
  def change
    create_table :friendly_id_slugs do |t|
      t.string   :slug,           :null => false
      t.integer  :sluggable_id,   :null => false
      t.string   :sluggable_type, :limit => 50
      t.string   :scope
      t.datetime :created_at
    end
    add_index :friendly_id_slugs, [:sluggable_type, :sluggable_id]
    add_index :friendly_id_slugs, [:slug, :sluggable_type], length: { slug: 140, sluggable_type: 50 }
    add_index :friendly_id_slugs, [:slug, :sluggable_type, :scope], length: { slug: 70, sluggable_type: 50, scope: 70 }, unique: true
    add_index :ability_scores, :slug, unique: true
    add_index :api_references, :slug, unique: true
    add_index :profs, :slug, unique: true
    add_index :sections, :slug, unique: true
    add_index :skills, :slug, unique: true

    AbilityScore.find_each(&:save)
    ApiReference.find_each(&:save)
    Condition.find_each(&:save)
    DndClass.find_each(&:save)
    Item.find_each(&:save)
    Monster.find_each(&:save)
    Prof.find_each(&:save)
    Race.find_each(&:save)
    Section.find_each(&:save)
    Skill.find_each(&:save)
    Spell.find_each(&:save)
  end
end
