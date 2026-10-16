# frozen_string_literal: true

# The Foundry module's view of a campaign (see CAMPAIGN_PLANNER.md, two-way sync).
#
# Pull: #changes_since(version) returns every record whose sync_version is newer,
# plus tombstones for deletions, and a cursor to send next time.
#
# Push: #apply(changes) takes at-the-table updates from Foundry (reveal a secret,
# advance a clock, change a quest's status, write the session log), and what
# the DM picks in Foundry (a place's scene, an NPC's actor, a session's scenes
# and treasure coins). Each change names the sync_version it was based on; if
# the record has moved on since, it comes back as a conflict with the current
# record so the module can merge.
class CampaignSync
  COLLECTIONS = {
    'factions' => :factions,
    'locations' => :locations,
    'npcs' => :npcs,
    'fronts' => :fronts,
    'quests' => :quests,
    'secrets' => :secrets,
    'sessions' => :sessions,
    'references' => :book_references
  }.freeze

  # What Foundry may change, per record type: payload key => model attribute
  WRITABLE = {
    'secret' => { collection: :secrets, fields: { 'revealed' => :revealed, 'revealedSessionUuid' => :revealed_session } },
    'front' => { collection: :fronts, fields: { 'clockFilled' => :clock_filled, 'portents' => :portents } },
    'quest' => { collection: :quests, fields: { 'status' => :status } },
    'session' => {
      collection: :sessions,
      fields: { 'log' => :log, 'recap' => :recap, 'status' => :status, 'foundryScenes' => :foundry_scenes,
                'treasureCurrency' => :treasure_currency }
    },
    'location' => { collection: :locations, fields: { 'foundrySceneUuid' => :foundry_scene_uuid, 'foundrySceneName' => :foundry_scene_name } },
    'npc' => { collection: :npcs, fields: { 'foundryActorUuid' => :foundry_actor_uuid, 'foundryActorName' => :foundry_actor_name } }
  }.freeze

  MAX_CHANGES = 100

  def initialize(campaign)
    @campaign = campaign
  end

  def changes_since(since)
    Campaign.transaction do
      # Waits for in-flight writes to this campaign (they hold its row lock
      # while bumping the counter), so nothing below the cursor is missed
      cursor = Campaign.lock('FOR SHARE').find(@campaign.id).sync_counter
      {
        cursor: cursor,
        full: since.zero?,
        campaign: campaign_json(since),
        records: COLLECTIONS.transform_values { |association| records_since(association, since) },
        tombstones: tombstones_since(since)
      }
    end
  end

  def apply(changes)
    results = { applied: [], conflicts: [], errors: [] }
    Array(changes).first(MAX_CHANGES).each { |change| apply_change(change.to_h.stringify_keys, results) }
    results.merge(cursor: @campaign.reload.sync_counter)
  end

  private

  def sync_json(record)
    record.as_json_for_api.merge(syncVersion: record.sync_version)
  end

  def campaign_json(since)
    return unless since.zero? || @campaign.sync_version > since

    @campaign.as_json_for_api.merge(syncVersion: @campaign.sync_version)
  end

  def records_since(association, since)
    scope = @campaign.public_send(association).where('sync_version > ?', since).order(:sync_version)
    scope = scope.includes(:monster, :stat_block_reference) if association == :npcs
    scope = scope.includes(links: :linkable) if association == :sessions
    scope.map { |record| sync_json(record) }
  end

  def tombstones_since(since)
    @campaign.tombstones.where('sync_version > ?', since).order(:sync_version).map do |tombstone|
      { type: tombstone.record_type, uuid: tombstone.record_uuid, syncVersion: tombstone.sync_version }
    end
  end

  def apply_change(change, results)
    config = WRITABLE[change['type']]
    return results[:errors] << { uuid: change['uuid'], errors: ["Can't change #{change['type'].inspect} records from Foundry"] } unless config

    record = @campaign.public_send(config[:collection]).find_by(uuid: change['uuid'].to_s)
    return results[:errors] << { uuid: change['uuid'], errors: ['Record not found'] } unless record

    if record.sync_version != change['baseVersion'].to_i
      return results[:conflicts] << { type: change['type'], uuid: record.uuid, current: sync_json(record) }
    end

    if record.update(attributes_for(config, change['attributes']))
      results[:applied] << { type: change['type'], uuid: record.uuid, current: sync_json(record) }
    else
      results[:errors] << { uuid: record.uuid, errors: record.errors.full_messages }
    end
  end

  def attributes_for(config, payload)
    payload = (payload.respond_to?(:to_unsafe_h) ? payload.to_unsafe_h : payload.to_h).deep_stringify_keys
    config[:fields].each_with_object({}) do |(key, attribute), attributes|
      next unless payload.key?(key)

      attributes[attribute] = attribute == :revealed_session ? session_for(payload[key]) : payload[key]
    end
  end

  def session_for(uuid)
    uuid.present? ? @campaign.sessions.find_by(uuid: uuid.to_s) : nil
  end
end
