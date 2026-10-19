# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_fronts
#
#  id             :bigint           not null, primary key
#  clock_filled   :integer          default(0), not null
#  clock_segments :integer          default(6), not null
#  description    :text
#  doom           :text
#  goal           :text
#  name           :string           not null
#  portents       :jsonb            not null
#  stakes         :jsonb            not null
#  sync_version   :bigint           default(0), not null
#  uuid           :uuid             not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  campaign_id    :bigint           not null
#  faction_id     :bigint
#  npc_id         :bigint
#
# Indexes
#
#  index_campaign_fronts_on_campaign_id                   (campaign_id)
#  index_campaign_fronts_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_fronts_on_faction_id                    (faction_id)
#  index_campaign_fronts_on_npc_id                        (npc_id)
#  index_campaign_fronts_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (faction_id => campaign_factions.id) ON DELETE => nullify
#  fk_rails_...  (npc_id => campaign_npcs.id) ON DELETE => nullify
#

# A threat driving events in the world (Dungeon World fronts / Lazy DM campaign
# fronts): a goal, the doom if nobody intervenes, grim portents along the way,
# and a progress clock (Blades in the Dark) that the DM advances between sessions.
class CampaignFront < ApplicationRecord
  include CampaignRecord

  linkable_from_sessions

  MAX_PORTENTS = 10
  MAX_STAKES = 10
  CLOCK_SEGMENTS = (2..12)

  belongs_to :npc, class_name: 'CampaignNpc', optional: true
  belongs_to :faction, class_name: 'CampaignFaction', optional: true

  validates :name, presence: true, length: { maximum: 120 }
  validates :clock_segments, numericality: { only_integer: true, in: CLOCK_SEGMENTS }
  validates :clock_filled, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates_string_list :stakes, max: MAX_STAKES
  validates_same_campaign :npc, :faction
  validate :clock_not_overfilled
  validate :portents_are_valid

  # Portents arrive as [{ text:, triggered: }]; keep only those keys
  def portents=(value)
    super(Array(value).map do |portent|
      portent = portent.to_h.stringify_keys
      { 'text' => portent['text'].to_s, 'triggered' => ActiveModel::Type::Boolean.new.cast(portent['triggered']) || false }
    end)
  end

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      name: name,
      description: description,
      goal: goal,
      doom: doom,
      stakes: stakes,
      portents: portents,
      clockSegments: clock_segments,
      clockFilled: clock_filled,
      npcId: npc_id&.to_s,
      factionId: faction_id&.to_s
    }
  end

  private

  def clock_not_overfilled
    return if clock_segments.blank? || clock_filled.blank? || clock_filled <= clock_segments

    errors.add(:clock_filled, "can't be more than the clock's segments")
  end

  def portents_are_valid
    return if portents.is_a?(Array) && portents.size <= MAX_PORTENTS && portents.all? { |p| p['text'].present? }

    errors.add(:portents, "must be up to #{MAX_PORTENTS} portents, each with text")
  end
end
