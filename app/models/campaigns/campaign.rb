# frozen_string_literal: true

# == Schema Information
#
# Table name: campaigns
#
#  id                        :bigint           not null, primary key
#  cadence                   :string
#  edition                   :string           default("2024"), not null
#  excluded_compendium_packs :jsonb            not null
#  mode                      :string           default("arc"), not null
#  name                      :string           not null
#  party_size                :integer
#  pitch                     :text
#  planned_sessions          :integer
#  premise                   :text
#  setting_name              :string
#  setting_notes             :text
#  slug                      :string           not null
#  start_level               :integer
#  status                    :string           default("planning"), not null
#  sync_counter              :bigint           default(0), not null
#  sync_version              :bigint           default(0), not null
#  target_level              :integer
#  tone                      :string
#  truths                    :jsonb            not null
#  uuid                      :uuid             not null
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  user_id                   :bigint           not null
#
# Indexes
#
#  index_campaigns_on_user_id           (user_id)
#  index_campaigns_on_user_id_and_slug  (user_id,slug) UNIQUE
#  index_campaigns_on_uuid              (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

# A DM's campaign plan. Owns the cast, places, factions, fronts (threats with
# progress clocks), quests, secrets & clues, and sessions.
class Campaign < ApplicationRecord
  extend FriendlyId

  # A reserved word ("New", "Session", ...) gets a suffixed slug instead of failing validation
  friendly_id :name, use: %i[slugged scoped], scope: :user, treat_reserved_as_conflict: true

  MODES = %w[arc sandbox oneshot].freeze
  STATUSES = %w[planning active completed archived].freeze
  # Truths of the setting: about six is plenty, but that's advice, not a rule
  MAX_TRUTHS = 20
  MAX_TRUTH_NAME_LENGTH = 120
  MAX_TRUTH_DESCRIPTION_LENGTH = 1000
  # Where a truth written as one string ends its first sentence
  TRUTH_SENTENCE_END = /[.!?]\s/
  # The planner is built on the 2024 rules (PHB, DMG and Monster Manual)
  EDITION = '2024'

  belongs_to :user
  has_many :factions, class_name: 'CampaignFaction', dependent: :destroy
  has_many :locations, class_name: 'CampaignLocation', dependent: :destroy
  has_many :npcs, class_name: 'CampaignNpc', dependent: :destroy
  has_many :fronts, class_name: 'CampaignFront', dependent: :destroy
  has_many :quests, class_name: 'CampaignQuest', dependent: :destroy
  has_many :sessions, class_name: 'CampaignSession', dependent: :destroy
  has_many :secrets, class_name: 'CampaignSecret', dependent: :destroy
  has_many :book_references, class_name: 'CampaignReference', dependent: :destroy
  has_many :party_members, class_name: 'CampaignPartyMember', dependent: :delete_all
  has_many :party, through: :party_members, source: :player_character
  has_many :tombstones, class_name: 'CampaignTombstone', dependent: :delete_all

  validates :name, presence: true, length: { maximum: 120 }
  validates :mode, inclusion: { in: MODES }
  validates :status, inclusion: { in: STATUSES }
  validates :edition, inclusion: { in: [EDITION] }
  validates :start_level, :target_level, numericality: { only_integer: true, in: 1..20 }, allow_nil: true
  validates :planned_sessions, numericality: { only_integer: true, in: 1..100 }, allow_nil: true
  validates :party_size, numericality: { only_integer: true, in: 1..12 }, allow_nil: true
  validate :target_level_not_below_start
  # Only when they change, so a campaign whose truths came from before these
  # limits (a long first sentence, say) can still be edited
  validate :truths_are_valid, if: -> { new_record? || truths_changed? }
  validate :excluded_compendium_packs_are_known

  before_validation :assign_uuid, on: :create
  before_update :assign_sync_version

  # Truths as they're kept: a list of { "name" => ..., "description" => ... },
  # trimmed, in order, leaving out empty ones. Each may arrive as an object
  # (string or symbol keys; other keys are dropped) or as a string, as older
  # clients send them: a string is split after its first sentence (see
  # .truth_from_text). Anything else is left as it is for validation to reject.
  # nil is no truths.
  def self.normalize_truths(value)
    return [] if value.nil?
    return value unless value.is_a?(Array)

    value.filter_map do |truth|
      truth = truth.to_unsafe_h if truth.respond_to?(:to_unsafe_h)
      entry = case truth
              when String then truth_from_text(truth)
              when Hash
                truth = truth.stringify_keys
                { 'name' => truth_text(truth['name']), 'description' => truth_text(truth['description']) }
              else truth
              end
      entry unless entry.nil? || (entry.is_a?(Hash) && entry.values.all?(''))
    end
  end

  # A truth written as one string: split after its first sentence end (".",
  # "!" or "?" followed by whitespace), the punctuation staying on the name.
  # "Greyhawk runs on gold. The Directing Oligarchy governs." is the name
  # "Greyhawk runs on gold." and the description "The Directing Oligarchy
  # governs."; with no sentence end, the whole string is the name.
  def self.truth_from_text(text)
    text = text.strip
    split = text =~ TRUTH_SENTENCE_END
    return { 'name' => text, 'description' => '' } unless split

    { 'name' => text[..split], 'description' => text[(split + 1)..].strip }
  end

  # A truth's name or description, trimmed; nil is blank, and anything that
  # isn't text is kept for validation to reject
  def self.truth_text(value)
    return '' if value.nil?

    value.is_a?(String) ? value.strip : value
  end
  private_class_method :truth_text

  # Truths arrive as [{ name:, description: }], or as strings from older clients
  def truths=(value)
    super(self.class.normalize_truths(value))
  end

  # Atomically bumps and returns this campaign's sync counter. Also marks the
  # campaign updated, so the campaign list sorts by recent activity.
  def next_sync_version!
    sql = self.class.sanitize_sql([
                                    'UPDATE campaigns SET sync_counter = sync_counter + 1, updated_at = ? WHERE id = ? RETURNING sync_counter',
                                    Time.current, id
                                  ])
    self.class.connection.select_value(sql).to_i
  end

  # Sets the party to these of the DM's player characters, ignoring any
  # that aren't the DM's
  def assign_party!(character_ids)
    self.party = user.player_characters.where(id: Array(character_ids))
  end

  # Three Clue Rule: each revelation should have at least three clues
  def revelation_summaries
    secrets.reject { |secret| secret.revelation.blank? }.group_by(&:revelation).map do |name, clues|
      { name: name, clueCount: clues.size, revealedCount: clues.count(&:revealed?) }
    end
  end

  # The first session not yet played (uses loaded sessions when preloaded)
  def upcoming_session
    sessions.reject { |session| session.status == 'played' }.min_by(&:number)
  end

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      slug: slug,
      name: name,
      premise: premise,
      pitch: pitch,
      settingName: setting_name,
      settingNotes: setting_notes,
      truths: truths,
      mode: mode,
      status: status,
      plannedSessions: planned_sessions,
      cadence: cadence,
      partySize: party_size,
      startLevel: start_level,
      targetLevel: target_level,
      tone: tone,
      edition: edition,
      excludedCompendiumPacks: excluded_compendium_packs,
      createdAt: created_at.iso8601,
      updatedAt: updated_at.iso8601
    }
  end

  # For the campaign list and dashboard widgets
  def as_summary_json_for_api
    upcoming = upcoming_session
    as_json_for_api.merge(
      sessionCount: sessions.size,
      nextSession: upcoming && {
        id: upcoming.id.to_s,
        number: upcoming.number,
        displayTitle: upcoming.display_title,
        scheduledOn: upcoming.scheduled_on&.iso8601,
        status: upcoming.status
      },
      clocks: fronts.sort_by(&:created_at).map do |front|
        { id: front.id.to_s, name: front.name, clockSegments: front.clock_segments, clockFilled: front.clock_filled }
      end
    )
  end

  # Everything the campaign page needs in one response
  def as_full_json_for_api
    as_json_for_api.merge(
      factions: factions.order(:name).map(&:as_json_for_api),
      locations: locations.order(:name).map(&:as_json_for_api),
      npcs: npcs.includes(:monster, :stat_block_reference).order(:name).map(&:as_json_for_api),
      fronts: fronts.order(:created_at).map(&:as_json_for_api),
      quests: quests.includes(links: :linkable).order(:kind, :act, :position, :created_at).map(&:as_json_for_api),
      secrets: secrets.order(:position, :created_at).map(&:as_json_for_api),
      sessions: sessions.includes(links: :linkable).order(:number).map(&:as_json_for_api),
      references: book_references.order(:book, :name).map(&:as_json_for_api),
      party: party.order(:name).map(&:as_json_for_api),
      revelations: revelation_summaries,
      sceneThumbnails: FoundryScene.thumbnail_urls(user, foundry_scene_uuids)
    )
  end

  # The Foundry scenes it uses as maps: each place's map, and each session's and quest's maps
  def foundry_scene_uuids
    listed = MapsAndCoins.scene_uuids(sessions.pluck(:foundry_scenes).flatten + quests.pluck(:foundry_scenes).flatten)
    (locations.where.not(foundry_scene_uuid: nil).pluck(:foundry_scene_uuid) + listed).uniq
  end

  private

  def assign_uuid
    self.uuid ||= SecureRandom.uuid
  end

  def assign_sync_version
    self.sync_version = next_sync_version!
  end

  def target_level_not_below_start
    return if start_level.blank? || target_level.blank? || target_level >= start_level

    errors.add(:target_level, "can't be lower than the starting level")
  end

  # Each message is a whole sentence (see config/locales/en.yml)
  def truths_are_valid
    return errors.add(:truths, 'Truths must be a list, each with a name and a description') unless truths_listed?

    errors.add(:truths, "A campaign can have up to #{MAX_TRUTHS} truths") if truths.size > MAX_TRUTHS
    errors.add(:truths, 'Each truth needs a name') if truths.any? { |truth| truth['name'].empty? }
    { 'name' => MAX_TRUTH_NAME_LENGTH, 'description' => MAX_TRUTH_DESCRIPTION_LENGTH }.each do |key, max|
      next unless truths.any? { |truth| truth[key].length > max }

      errors.add(:truths, "A truth's #{key} is too long (maximum is #{max} characters)")
    end
  end

  # A list of truths, each with a name and a description
  def truths_listed?
    truths.is_a?(Array) && truths.all? { |truth| truth.is_a?(Hash) && truth.values_at('name', 'description').all?(String) }
  end

  def excluded_compendium_packs_are_known
    packs = excluded_compendium_packs
    return if packs.is_a?(Array) && (packs - CompendiumEntry::PACKS.keys).empty?

    errors.add(:excluded_compendium_packs, 'must be a list of supported compendiums')
  end
end
