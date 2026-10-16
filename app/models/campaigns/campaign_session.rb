# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_sessions
#
#  id                :bigint           not null, primary key
#  character_notes   :text
#  foundry_scenes    :jsonb            not null
#  level             :integer
#  log               :text
#  number            :integer          not null
#  recap             :text
#  scenes            :jsonb            not null
#  scheduled_on      :date
#  status            :string           default("planned"), not null
#  strong_start      :text
#  sync_version      :bigint           default(0), not null
#  title             :string
#  treasure          :text
#  treasure_currency :jsonb            not null
#  uuid              :uuid             not null
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  campaign_id       :bigint           not null
#
# Indexes
#
#  index_campaign_sessions_on_campaign_id                   (campaign_id)
#  index_campaign_sessions_on_campaign_id_and_number        (campaign_id,number) UNIQUE
#  index_campaign_sessions_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_sessions_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

# One game session, prepped with the Lazy DM's eight steps:
# 1 review the characters (character_notes), 2 strong start, 3 potential scenes,
# 4 secrets & clues, 5 fantastic locations, 6 important NPCs, 7 relevant
# monsters (4-7 are links), 8 treasure (treasure, treasure_currency and item
# links). Run mode fills in the log; the recap is written afterwards.
# foundry_scenes are the Foundry scenes the DM picked for it in Foundry.
class CampaignSession < ApplicationRecord
  include CampaignRecord

  STATUSES = %w[planned prepped played].freeze
  MAX_SCENES = 20
  MAX_FOUNDRY_SCENES = 20
  MAX_SCENE_NAME = 120
  COINS = %w[pp gp ep sp cp].freeze
  MAX_COINS = 1_000_000

  has_many :links, -> { order(:position, :id) }, class_name: 'CampaignSessionLink', foreign_key: :session_id,
                                                 inverse_of: :session, dependent: :destroy
  has_many :revealed_secrets, class_name: 'CampaignSecret', foreign_key: :revealed_session_id,
                              inverse_of: :revealed_session, dependent: nil

  MAX_NUMBER = 1000

  validates :number, numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: MAX_NUMBER },
                     uniqueness: { scope: :campaign_id }
  validates :title, length: { maximum: 120 }
  validates :status, inclusion: { in: STATUSES }
  validates :level, numericality: { only_integer: true, in: 1..20 }, allow_nil: true
  validates_string_list :scenes, max: MAX_SCENES
  validate :foundry_scenes_are_valid
  validate :treasure_currency_is_valid

  before_validation :assign_next_number, on: :create

  def display_title
    title.presence || "Session #{number}"
  end

  # Scenes arrive from Foundry as [{ uuid:, name: }]; keep only those keys.
  # Anything else is left for validation to reject.
  def foundry_scenes=(value)
    value = [] if value.nil?
    value = value.map { |scene| scene.is_a?(Hash) ? scene.stringify_keys.slice('uuid', 'name') : scene } if value.is_a?(Array)
    super
  end

  # Coins arrive as { gp: 50, sp: 12 }. Whole numbers sent as text (from a
  # form) become numbers; anything else is left for validation to reject.
  def treasure_currency=(value)
    value = {} if value.nil?
    value = value.to_unsafe_h if value.respond_to?(:to_unsafe_h)
    if value.is_a?(Hash)
      value = value.each_with_object({}) do |(coin, count), coins|
        coins[coin.to_s] = count.is_a?(String) && count.match?(/\A\d+\z/) ? count.to_i : count
      end
    end
    super
  end

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      number: number,
      title: title,
      displayTitle: display_title,
      scheduledOn: scheduled_on&.iso8601,
      status: status,
      level: level,
      characterNotes: character_notes,
      strongStart: strong_start,
      scenes: scenes,
      treasure: treasure,
      treasureCurrency: treasure_currency,
      foundryScenes: foundry_scenes,
      log: log,
      recap: recap,
      links: links.select(&:linkable).map(&:as_json_for_api)
    }
  end

  private

  def assign_next_number
    self.number ||= (campaign&.sessions&.maximum(:number) || 0) + 1
  end

  def foundry_scenes_are_valid
    return if foundry_scenes.is_a?(Array) && foundry_scenes.size <= MAX_FOUNDRY_SCENES && foundry_scenes.all? { |scene| foundry_scene?(scene) }

    errors.add(:foundry_scenes, "must be up to #{MAX_FOUNDRY_SCENES} Foundry scenes, each with a scene UUID and a name " \
                                "of up to #{MAX_SCENE_NAME} characters")
  end

  def foundry_scene?(scene)
    scene.is_a?(Hash) && scene['uuid'].is_a?(String) && scene['uuid'].match?(CampaignLocation::FOUNDRY_SCENE_UUID) &&
      scene['name'].is_a?(String) && scene['name'].present? && scene['name'].length <= MAX_SCENE_NAME
  end

  def treasure_currency_is_valid
    valid = treasure_currency.is_a?(Hash) && treasure_currency.all? do |coin, count|
      COINS.include?(coin) && count.is_a?(Integer) && count.between?(0, MAX_COINS)
    end
    return if valid

    coins = COINS.to_sentence(last_word_connector: ' and ')
    errors.add(:treasure_currency, "must be whole numbers of #{coins}, up to #{MAX_COINS.to_fs(:delimited)} each")
  end
end
