# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_references
#
#  id               :bigint           not null, primary key
#  book             :string           default("mm"), not null
#  category         :string           default("monster"), not null
#  challenge_rating :string
#  foundry_uuid     :string
#  name             :string           not null
#  notes            :text
#  page             :integer
#  sync_version     :bigint           default(0), not null
#  uuid             :uuid             not null
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  campaign_id      :bigint           not null
#
# Indexes
#
#  index_campaign_references_on_campaign_id                   (campaign_id)
#  index_campaign_references_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_references_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

# A pointer into one of the 2024 core books, e.g. "Cult Fanatic, Monster
# Manual p. 92". Only the name and page are stored, never text or stat
# blocks from the books. The Foundry companion module can set foundry_uuid
# to the matching entry in the DM's own licensed compendium.
class CampaignReference < ApplicationRecord
  include CampaignRecord

  linkable_from_sessions

  BOOKS = {
    'phb' => "Player's Handbook",
    'dmg' => "Dungeon Master's Guide",
    'mm' => 'Monster Manual',
    'other' => 'Other'
  }.freeze
  CATEGORIES = %w[monster magic_item spell table rule other].freeze
  CHALLENGE_RATING = %r{\A(0|1/8|1/4|1/2|[1-9]|[12][0-9]|30)\z}

  has_many :npcs, class_name: 'CampaignNpc', foreign_key: :stat_block_reference_id,
                  inverse_of: :stat_block_reference, dependent: nil

  validates :name, presence: true, length: { maximum: 120 }
  validates :book, inclusion: { in: BOOKS.keys }
  validates :category, inclusion: { in: CATEGORIES }
  validates :page, numericality: { only_integer: true, in: 1..999 }, allow_nil: true
  validates :challenge_rating, format: { with: CHALLENGE_RATING }, allow_blank: true
  validates :foundry_uuid, length: { maximum: 255 }

  # e.g. "Monster Manual p. 92"
  def citation
    [BOOKS[book], page && "p. #{page}"].compact.join(' ')
  end

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      name: name,
      book: book,
      category: category,
      page: page,
      challengeRating: challenge_rating,
      foundryUuid: foundry_uuid,
      notes: notes,
      citation: citation
    }
  end
end
