# frozen_string_literal: true

# The Foundry module's view of a campaign (see CAMPAIGN_PLANNER.md, two-way sync).
#
# Pull: #changes_since(version) returns every record whose sync_version is newer,
# plus tombstones for deletions, and a cursor to send next time.
#
# Push: #apply(changes) takes the DM's edits in Foundry (see CampaignSync::Change).
# Each change is one of:
# - update (the default): { type, uuid, baseVersion, attributes }. If the record
#   has moved on since baseVersion, it comes back as a conflict with the current
#   record so the module can merge.
# - create: { op: "create", type, uuid, attributes }, with a new UUID v4 made in Foundry
# - delete: { op: "delete", type, uuid }, cleaned up as on the website
# Attributes use the pull's camelCase keys (WRITABLE). Ids (factionId, an
# encounter's questId, a link's linkableId) are DM Guru record ids; a session's,
# quest's or encounter's links are its whole list (see CampaignSync::Links).
# Each change saves on its own, all or nothing.
class CampaignSync
  # A change that can't be applied, and why
  class Rejected < StandardError
    attr_reader :messages

    def initialize(messages)
      @messages = Array(messages)
      super(@messages.join('; '))
    end
  end

  COLLECTIONS = {
    'factions' => :factions,
    'locations' => :locations,
    'npcs' => :npcs,
    'fronts' => :fronts,
    'quests' => :quests,
    'encounters' => :encounters,
    'secrets' => :secrets,
    'sessions' => :sessions,
    'references' => :book_references
  }.freeze

  # What Foundry may set, per record type, by the pull's camelCase keys
  # (settingName is setting_name). The campaign itself has no collection: it
  # can be updated, but not created or deleted.
  WRITABLE = {
    'campaign' => {
      collection: nil,
      fields: %w[name premise pitch settingName settingNotes truths tone partySize startLevel targetLevel plannedSessions
                 cadence status]
    },
    'faction' => { collection: :factions, fields: %w[name goal description notes] },
    'location' => {
      collection: :locations,
      fields: %w[name description features notes parentId foundrySceneUuid foundrySceneName rollTables]
    },
    'npc' => {
      collection: :npcs,
      fields: %w[name role description motive secret appearance voice notes factionId statBlockReferenceId
                 foundryActorUuid foundryActorName]
    },
    'front' => {
      collection: :fronts,
      fields: %w[name goal doom description portents stakes clockSegments clockFilled npcId factionId]
    },
    'quest' => {
      collection: :quests,
      fields: %w[name kind status act description reward notes levelMin levelMax parentId giverNpcId locationId
                 foundryScenes rewardCurrency rewardXp milestone handouts links]
    },
    'encounter' => {
      collection: :encounters,
      fields: %w[name kind description notes position questId foundryScenes rewardCurrency rewardXp links]
    },
    'secret' => { collection: :secrets, fields: %w[text revelation revealed revealedSessionUuid position] },
    'session' => {
      collection: :sessions,
      fields: %w[title scheduledOn level status characterNotes strongStart scenes treasure treasureCurrency foundryScenes
                 log recap links]
    },
    'reference' => {
      collection: :book_references,
      fields: %w[name book category page challengeRating foundryUuid notes]
    }
  }.freeze

  # A DM Guru record id, as the pull returns it (or as a number)
  ID_FORMAT = /\A\d{1,18}\z/
  MAX_CHANGES = 100

  # "a quest", "an encounter"
  def self.with_article(noun)
    "#{noun.to_s.match?(/\A[aeiou]/i) ? 'an' : 'a'} #{noun}"
  end

  # A record as the pull returns it
  def self.sync_json(record)
    record.as_json_for_api.merge(syncVersion: record.sync_version)
  end

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

  # Returns { applied:, conflicts:, errors:, deleted:, cursor: }
  def apply(changes)
    results = { applied: [], conflicts: [], errors: [], deleted: [] }
    Array(changes).first(MAX_CHANGES).each { |change| apply_change(change, results) }
    results.merge(cursor: @campaign.reload.sync_counter)
  end

  private

  def campaign_json(since)
    return unless since.zero? || @campaign.sync_version > since

    self.class.sync_json(@campaign)
  end

  def records_since(association, since)
    scope = @campaign.public_send(association).where('sync_version > ?', since).order(:sync_version)
    scope = scope.includes(:monster, :stat_block_reference) if association == :npcs
    scope = scope.includes(links: :linkable) if %i[sessions quests encounters].include?(association)
    scope.map { |record| self.class.sync_json(record) }
  end

  def tombstones_since(since)
    @campaign.tombstones.where('sync_version > ?', since).order(:sync_version).map do |tombstone|
      { type: tombstone.record_type, uuid: tombstone.record_uuid, syncVersion: tombstone.sync_version }
    end
  end

  # Each change in its own transaction, so one that fails undoes only itself
  def apply_change(change, results)
    change = change.to_unsafe_h if change.respond_to?(:to_unsafe_h)
    return results[:errors] << { uuid: nil, errors: ['Each change must be an object'] } unless change.is_a?(Hash)

    change = change.deep_stringify_keys
    outcome, entry = Campaign.transaction(requires_new: true) do
      # Holds off the campaign's other writes until this one is done, so
      # another edit can't land between the version check and the save
      @campaign.reload(lock: true)
      Change.new(@campaign, change).apply
    end
    results[outcome] << entry
  rescue Rejected => e
    results[:errors] << { uuid: change['uuid'], errors: e.messages }
  rescue ActiveRecord::RecordInvalid => e
    results[:errors] << { uuid: change['uuid'], errors: e.record.errors.full_messages }
  rescue ActiveRecord::RecordNotUnique
    results[:errors] << { uuid: change['uuid'], errors: ['That conflicts with a change made at the same time. Please try again.'] }
  rescue ActiveModel::RangeError
    results[:errors] << { uuid: change['uuid'], errors: ['A number is out of range'] }
  end
end
