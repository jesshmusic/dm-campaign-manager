class CreateCampaignReferences < ActiveRecord::Migration[7.1]
  # Pointers into the 2024 core books (PHB, DMG, Monster Manual): a name and
  # page, never text or stat blocks. The Foundry module can fill in
  # foundry_uuid with the matching entry in the DM's own licensed compendium.
  def change
    create_table :campaign_references do |t|
      t.references :campaign, null: false, foreign_key: true
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.string :name, null: false
      t.string :book, null: false, default: 'mm'
      t.string :category, null: false, default: 'monster'
      t.integer :page
      t.string :challenge_rating
      t.string :foundry_uuid
      t.text :notes
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end
    add_index :campaign_references, :uuid, unique: true
    add_index :campaign_references, %i[campaign_id sync_version]

    add_reference :campaign_npcs, :stat_block_reference,
                  foreign_key: { to_table: :campaign_references, on_delete: :nullify }
  end
end
