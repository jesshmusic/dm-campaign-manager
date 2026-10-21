# frozen_string_literal: true

# == Schema Information
#
# Table name: compendium_entries
#
#  id               :bigint           not null, primary key
#  category         :string           not null
#  challenge_rating :string
#  detail           :string
#  foundry_uuid     :string           not null
#  homebrew         :boolean          default(FALSE), not null
#  name             :string           not null
#  pack             :string           not null
#  pack_label       :string
#  pack_version     :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_compendium_entries_on_user_id_and_category_and_name  (user_id,category,name)
#  index_compendium_entries_on_user_id_and_foundry_uuid       (user_id,foundry_uuid) UNIQUE
#  index_compendium_entries_on_user_id_and_pack               (user_id,pack)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

# One entry from a DM's Foundry compendium index, e.g. "Zombie, CR 1/4,
# Monster Manual". Dorman Lakely's Campaign Planner module sends the index of
# the free SRD 5.2 packs and the 2024 core books the DM owns, so planner
# searches can link straight to the compendium entry: dragged from a session
# journal onto a scene, it becomes a token. Only names, CRs and compendium
# UUIDs are stored, never stat blocks or book text, and only for that DM.
#
# It can also send the DM's homebrew: a world's actors (pack
# "world-actors.<world id>", whose entries are that world's actors,
# "Actor.<id>") and any compendium the DM picks (its real id, e.g.
# "world.my-monsters"), each labelled with its title.
class CompendiumEntry < ApplicationRecord
  # The packs the module sends: the book each is from and what it holds. The
  # official packs use the same UUIDs in every world, so links work in any of them.
  PACKS = {
    'dnd-players-handbook.spells' => { book: 'phb', label: 'Spells' },
    'dnd-players-handbook.equipment' => { book: 'phb', label: 'Equipment' },
    'dnd-players-handbook.actors' => { book: 'phb', label: 'Creatures' },
    'dnd-dungeon-masters-guide.equipment' => { book: 'dmg', label: 'Magic items' },
    'dnd-dungeon-masters-guide.tables' => { book: 'dmg', label: 'Tables' },
    'dnd-dungeon-masters-guide.actors' => { book: 'dmg', label: 'Creatures' },
    'dnd-monster-manual.actors' => { book: 'mm', label: 'Monsters' },
    'dnd-monster-manual.tables' => { book: 'mm', label: 'Tables' },
    'dnd5e.actors24' => { book: 'srd', label: 'Monsters' },
    'dnd5e.spells24' => { book: 'srd', label: 'Spells' },
    'dnd5e.equipment24' => { book: 'srd', label: 'Equipment and magic items' },
    'dnd5e.tables24' => { book: 'srd', label: 'Tables' }
  }.freeze
  CATEGORIES = %w[monster spell magic_item equipment table].freeze
  MAX_ENTRIES_PER_PACK = 2000
  MAX_RESULTS = 20
  # When a book and the SRD both have something, search shows the book's
  BOOK_ORDER = %w[mm dmg phb srd].freeze
  # e.g. Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000
  UUID_FORMAT = /\A[\w.-]{1,255}\z/
  # A homebrew pack: "<package>.<pack>", e.g. world.my-monsters or some-module.monsters
  PACK_ID_FORMAT = /\A[\w-]+\.[\w-]+\z/
  MAX_PACK_ID = 100
  MAX_PACK_LABEL = 120
  MAX_HOMEBREW_PACKS = 50
  # A world's own actors, rather than a compendium's: "world-actors.<Foundry world id>"
  WORLD_ACTORS = /\Aworld-actors\.[a-z0-9-]+\z/
  WORLD_ACTOR_UUID = /\AActor\.[A-Za-z0-9]{16}\z/
  HOMEBREW = 'Homebrew'

  belongs_to :user

  validates :pack, inclusion: { in: PACKS.keys }, unless: :homebrew?
  validates :pack, format: { with: PACK_ID_FORMAT }, length: { maximum: MAX_PACK_ID }, if: :homebrew?
  validates :pack_label, presence: true, length: { maximum: MAX_PACK_LABEL }, if: :homebrew?
  validates :category, inclusion: { in: CATEGORIES }
  validates :name, presence: true, length: { maximum: 120 }
  validates :foundry_uuid, format: { with: UUID_FORMAT }

  # A pack id a campaign can leave out: a core book pack, or a homebrew one
  def self.pack_id?(pack)
    pack.is_a?(String) && (PACKS.key?(pack) || (pack.length <= MAX_PACK_ID && pack.match?(PACK_ID_FORMAT)))
  end

  # Replaces the user's entries from one pack with what the module sent,
  # skipping any that aren't valid. Returns how many were saved. `label` is a
  # homebrew pack's title (nil for the core packs).
  def self.replace_pack!(user, pack, version, entries, label: nil)
    homebrew = !PACKS.key?(pack)
    rows = entries.first(MAX_ENTRIES_PER_PACK).filter_map { |entry| row_for(pack, entry) }
                  .uniq { |row| row[:foundry_uuid] }
    now = Time.current
    transaction do
      user.compendium_entries.where(pack: pack).delete_all
      # One insert for hundreds of entries; row_for has already checked each one
      if rows.any?
        insert_all!(rows.map do |row| # rubocop:disable Rails/SkipsModelValidations
          row.merge(user_id: user.id, pack: pack, pack_version: version, homebrew: homebrew, pack_label: homebrew ? label : nil,
                    created_at: now, updated_at: now)
        end)
      end
    end
    rows.size
  end

  # Entries with a word in their name starting with the query ("fanatic"
  # finds Cult Fanatic, "gh" doesn't find Knight), names starting with it
  # first. A book entry hides the SRD entry of the same name; homebrew is
  # never hidden.
  def self.search(query, categories: [])
    scope = all
    scope = scope.where(category: categories) if categories.any?
    # \m is the start of a word in a PostgreSQL regular expression
    scope = scope.where('name ~* ?', "\\m#{Regexp.escape(query.strip)}") if query.present?
    prefix = query.strip.downcase
    scope.order(:name).limit(500).to_a
         .sort_by { |entry| [entry.name.downcase.start_with?(prefix) ? 0 : 1, BOOK_ORDER.index(entry.book) || 99] }
         .uniq { |entry| entry.homebrew? ? entry.foundry_uuid : [entry.name.downcase, entry.category] }
         .first(MAX_RESULTS)
  end

  # A pack's entries are its compendium's ("Compendium.<pack>.…"), or for a
  # world's actors, world actors ("Actor.<id>")
  def self.uuid_in_pack?(pack, uuid)
    return uuid.match?(WORLD_ACTOR_UUID) if pack.match?(WORLD_ACTORS)

    uuid.start_with?("Compendium.#{pack}.") && uuid.match?(UUID_FORMAT)
  end
  private_class_method :uuid_in_pack?

  def self.row_for(pack, entry)
    uuid = entry['uuid'].to_s
    name = entry['name'].to_s.squish
    category = entry['category'].to_s
    challenge_rating = entry['challengeRating'].presence&.to_s
    return unless uuid_in_pack?(pack, uuid)
    return unless name.present? && name.length <= 120 && CATEGORIES.include?(category)
    return if challenge_rating && !challenge_rating.match?(CampaignReference::CHALLENGE_RATING)

    { foundry_uuid: uuid, name: name, category: category, challenge_rating: challenge_rating,
      detail: entry['detail'].to_s.squish.first(80).presence }
  end
  private_class_method :row_for

  # The user's packs with entry counts, in PACKS order, then homebrew by label:
  # [{ pack:, book:, bookName:, label:, count:, homebrew: }]
  def self.pack_summaries
    counts = group(:pack).count
    core = PACKS.filter_map do |pack, info|
      next unless counts[pack]

      { pack: pack, book: info[:book], bookName: CampaignReference::BOOKS[info[:book]], label: info[:label],
        count: counts[pack], homebrew: false }
    end
    homebrew = where(homebrew: true).group(:pack, :pack_label).count.map do |(pack, label), count|
      { pack: pack, book: 'other', bookName: HOMEBREW, label: label.presence || pack, count: count, homebrew: true }
    end
    core + homebrew.sort_by { |summary| [summary[:label].downcase, summary[:pack]] }
  end

  # Homebrew is "other", like a book reference to anything outside the core books
  def book
    homebrew? ? 'other' : PACKS.dig(pack, :book)
  end

  # "Monster Manual", or a homebrew pack's "Homebrew: My Monsters"
  def book_name
    homebrew? ? "#{HOMEBREW}: #{pack_label.presence || pack}" : CampaignReference::BOOKS[book]
  end

  def as_json_for_api
    {
      id: id.to_s,
      name: name,
      category: category,
      book: book,
      bookName: book_name,
      challengeRating: challenge_rating,
      detail: detail,
      foundryUuid: foundry_uuid,
      homebrew: homebrew
    }
  end
end
