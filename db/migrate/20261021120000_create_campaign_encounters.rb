# A quest's encounters: a fight, a talk, a puzzle or a trap along the way,
# each with its own monsters (how many of each), NPCs, maps (Foundry scenes)
# and reward (items with how many, coins and XP). They're planner records of
# their own, synced with Foundry like quests. Quests also get handouts: Foundry
# journal entries or pages the DM drops on a quest in Foundry.
#
# A quest's monsters move into one new encounter per quest ("Encounter", a
# fight), in the same order and with the same counts, and leave the quest: the
# quest links go (each leaves a tombstone, as removing a link does), and the
# quest and its new encounter get new sync versions so Foundry pulls them.
# Down moves every encounter's monsters back onto its quest, leaving tombstones
# for the encounters, before the tables go.
class CreateCampaignEncounters < ActiveRecord::Migration[7.1]
  # Lightweight models, so this migration doesn't depend on the app's
  class Campaign < ActiveRecord::Base
    self.table_name = 'campaigns'
  end

  class CampaignReference < ActiveRecord::Base
    self.table_name = 'campaign_references'
  end

  class CampaignQuest < ActiveRecord::Base
    self.table_name = 'campaign_quests'
  end

  class CampaignQuestLink < ActiveRecord::Base
    self.table_name = 'campaign_quest_links'
  end

  class CampaignEncounter < ActiveRecord::Base
    self.table_name = 'campaign_encounters'
  end

  class CampaignEncounterLink < ActiveRecord::Base
    self.table_name = 'campaign_encounter_links'
  end

  class CampaignTombstone < ActiveRecord::Base
    self.table_name = 'campaign_tombstones'
  end

  def up
    create_table :campaign_encounters do |t|
      t.references :campaign, null: false, foreign_key: true
      t.references :quest, null: false, foreign_key: { to_table: :campaign_quests, on_delete: :cascade }
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.string :name, null: false
      # combat, social, exploration, puzzle, trap or other
      t.string :kind, null: false, default: 'combat'
      t.text :description
      t.text :notes
      t.integer :position, null: false, default: 0
      # [{ "uuid": "Scene.xxxx", "name": "Mountain Pass" }]
      t.jsonb :foundry_scenes, null: false, default: []
      # { "gp": 50, "sp": 12 }
      t.jsonb :reward_currency, null: false, default: {}
      t.integer :reward_xp
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end
    add_index :campaign_encounters, :uuid, unique: true
    add_index :campaign_encounters, %i[campaign_id sync_version]

    create_table :campaign_encounter_links do |t|
      t.references :encounter, null: false, foreign_key: { to_table: :campaign_encounters, on_delete: :cascade }
      t.references :linkable, polymorphic: true, null: false
      t.uuid :uuid, null: false, default: -> { 'gen_random_uuid()' }
      t.integer :position, null: false, default: 0
      t.integer :quantity
      t.bigint :sync_version, null: false, default: 0
      t.timestamps
    end
    add_index :campaign_encounter_links, :uuid, unique: true
    add_index :campaign_encounter_links, %i[encounter_id linkable_type linkable_id],
              unique: true, name: 'index_campaign_encounter_links_uniqueness'

    # [{ "uuid": "JournalEntry.xxxx", "name": "A letter from Lareth" }]
    add_column :campaign_quests, :handouts, :jsonb, null: false, default: []

    move_monsters_into_encounters
  end

  def down
    move_monsters_back_to_quests

    remove_column :campaign_quests, :handouts
    drop_table :campaign_encounter_links
    drop_table :campaign_encounters
  end

  # Each quest's monster links (DM Guru monsters, and book references to
  # monsters) become one encounter's, in order, with their counts
  def move_monsters_into_encounters
    reset_models
    monster_links = CampaignQuestLink.where(linkable_type: 'Monster').or(
      CampaignQuestLink.where(linkable_type: 'CampaignReference',
                              linkable_id: CampaignReference.where(category: 'monster').select(:id))
    )
    monster_links.order(:quest_id, :position, :id).group_by(&:quest_id).each do |quest_id, links|
      quest = CampaignQuest.find(quest_id)
      encounter = CampaignEncounter.create!(campaign_id: quest.campaign_id, quest_id: quest.id, uuid: SecureRandom.uuid,
                                            name: 'Encounter', kind: 'combat', position: 0,
                                            sync_version: next_sync_version(quest.campaign_id))
      links.each_with_index do |link, position|
        CampaignEncounterLink.create!(encounter_id: encounter.id, linkable_type: link.linkable_type,
                                      linkable_id: link.linkable_id, quantity: link.quantity, position: position,
                                      uuid: SecureRandom.uuid, sync_version: next_sync_version(quest.campaign_id))
        remove_link(link, quest.campaign_id)
      end
      bump(quest, encounter)
    end
  end

  # Every encounter's monster links go back to its quest, after the quest's
  # own links (a monster on several of a quest's encounters once, with their
  # counts added up), and each encounter leaves a tombstone
  def move_monsters_back_to_quests
    reset_models
    CampaignEncounter.order(:quest_id, :position, :id).group_by(&:quest_id).each do |quest_id, encounters|
      quest = CampaignQuest.find(quest_id)
      counts = monster_counts(encounters)
      position = (CampaignQuestLink.where(quest_id: quest.id).maximum(:position) || -1) + 1
      counts.each do |(linkable_type, linkable_id), count|
        CampaignQuestLink.create!(quest_id: quest.id, linkable_type: linkable_type, linkable_id: linkable_id,
                                  quantity: count > 1 ? count : nil, position: position, uuid: SecureRandom.uuid,
                                  sync_version: next_sync_version(quest.campaign_id))
        position += 1
      end
      encounters.each { |encounter| remove_encounter(encounter) }
      bump(quest)
    end
  end

  private

  def reset_models
    [CampaignQuestLink, CampaignEncounter, CampaignEncounterLink, CampaignQuest, CampaignTombstone].each(&:reset_column_information)
  end

  # { [type, id] => how many } for the encounters' monsters, in order; a
  # quantity of nil is one
  def monster_counts(encounters)
    links = CampaignEncounterLink.where(encounter_id: encounters.map(&:id))
    order = encounters.map(&:id)
    links.sort_by { |link| [order.index(link.encounter_id), link.position, link.id] }
         .select { |link| monster?(link) }
         .each_with_object(Hash.new(0)) do |link, counts|
      counts[[link.linkable_type, link.linkable_id]] = [counts[[link.linkable_type, link.linkable_id]] + (link.quantity || 1), 9999].min
    end
  end

  def monster?(link)
    link.linkable_type == 'Monster' ||
      (link.linkable_type == 'CampaignReference' && CampaignReference.where(id: link.linkable_id, category: 'monster').exists?)
  end

  def remove_encounter(encounter)
    CampaignEncounterLink.where(encounter_id: encounter.id).find_each { |link| tombstone(encounter.campaign_id, 'CampaignEncounterLink', link.uuid) }
    CampaignEncounterLink.where(encounter_id: encounter.id).delete_all
    tombstone(encounter.campaign_id, 'CampaignEncounter', encounter.uuid)
    encounter.delete
  end

  def remove_link(link, campaign_id)
    tombstone(campaign_id, 'CampaignQuestLink', link.uuid)
    link.delete
  end

  def tombstone(campaign_id, record_type, uuid)
    CampaignTombstone.create!(campaign_id: campaign_id, record_type: record_type, record_uuid: uuid,
                              sync_version: next_sync_version(campaign_id))
  end

  # New sync versions, so a Foundry world's next pull carries them
  def bump(*records)
    records.each { |record| record.update_columns(sync_version: next_sync_version(record.campaign_id)) } # rubocop:disable Rails/SkipsModelValidations
  end

  # Bumps and returns the campaign's sync counter, as Campaign#next_sync_version! does
  def next_sync_version(campaign_id)
    sql = Campaign.sanitize_sql(['UPDATE campaigns SET sync_counter = sync_counter + 1 WHERE id = ? RETURNING sync_counter',
                                 campaign_id])
    Campaign.connection.select_value(sql).to_i
  end
end
