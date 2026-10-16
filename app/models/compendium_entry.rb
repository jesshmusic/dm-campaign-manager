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
#  name             :string           not null
#  pack             :string           not null
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

  belongs_to :user

  validates :pack, inclusion: { in: PACKS.keys }
  validates :category, inclusion: { in: CATEGORIES }
  validates :name, presence: true, length: { maximum: 120 }
  validates :foundry_uuid, format: { with: UUID_FORMAT }

  # Replaces the user's entries from one pack with what the module sent,
  # skipping any that aren't valid. Returns how many were saved.
  def self.replace_pack!(user, pack, version, entries)
    rows = entries.first(MAX_ENTRIES_PER_PACK).filter_map { |entry| row_for(pack, entry) }
                  .uniq { |row| row[:foundry_uuid] }
    now = Time.current
    transaction do
      user.compendium_entries.where(pack: pack).delete_all
      # One insert for hundreds of entries; row_for has already checked each one
      if rows.any?
        insert_all!(rows.map do |row| # rubocop:disable Rails/SkipsModelValidations
          row.merge(user_id: user.id, pack: pack, pack_version: version, created_at: now, updated_at: now)
        end)
      end
    end
    rows.size
  end

  # Entries with a word in their name starting with the query ("fanatic"
  # finds Cult Fanatic, "gh" doesn't find Knight), names starting with it
  # first. A book entry hides the SRD entry of the same name.
  def self.search(query, categories: [])
    scope = all
    scope = scope.where(category: categories) if categories.any?
    # \m is the start of a word in a PostgreSQL regular expression
    scope = scope.where('name ~* ?', "\\m#{Regexp.escape(query.strip)}") if query.present?
    prefix = query.strip.downcase
    scope.order(:name).limit(500).to_a
         .sort_by { |entry| [entry.name.downcase.start_with?(prefix) ? 0 : 1, BOOK_ORDER.index(entry.book) || 99] }
         .uniq { |entry| [entry.name.downcase, entry.category] }
         .first(MAX_RESULTS)
  end

  def self.row_for(pack, entry)
    uuid = entry['uuid'].to_s
    name = entry['name'].to_s.squish
    category = entry['category'].to_s
    challenge_rating = entry['challengeRating'].presence&.to_s
    return unless uuid.start_with?("Compendium.#{pack}.") && uuid.match?(UUID_FORMAT)
    return unless name.present? && name.length <= 120 && CATEGORIES.include?(category)
    return if challenge_rating && !challenge_rating.match?(CampaignReference::CHALLENGE_RATING)

    { foundry_uuid: uuid, name: name, category: category, challenge_rating: challenge_rating,
      detail: entry['detail'].to_s.squish.first(80).presence }
  end
  private_class_method :row_for

  # The user's packs with entry counts, in PACKS order:
  # [{ pack:, book:, bookName:, label:, count: }]
  def self.pack_summaries
    counts = group(:pack).count
    PACKS.filter_map do |pack, info|
      next unless counts[pack]

      { pack: pack, book: info[:book], bookName: CampaignReference::BOOKS[info[:book]], label: info[:label],
        count: counts[pack] }
    end
  end

  def book
    PACKS.dig(pack, :book)
  end

  def as_json_for_api
    {
      id: id.to_s,
      name: name,
      category: category,
      book: book,
      bookName: CampaignReference::BOOKS[book],
      challengeRating: challenge_rating,
      detail: detail,
      foundryUuid: foundry_uuid
    }
  end
end
