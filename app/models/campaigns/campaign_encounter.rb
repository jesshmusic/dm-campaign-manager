# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_encounters
#
#  id              :bigint           not null, primary key
#  description     :text
#  foundry_scenes  :jsonb            not null
#  kind            :string           default("combat"), not null
#  name            :string           not null
#  notes           :text
#  position        :integer          default(0), not null
#  reward_currency :jsonb            not null
#  reward_xp       :integer
#  sync_version    :bigint           default(0), not null
#  uuid            :uuid             not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  campaign_id     :bigint           not null
#  quest_id        :bigint           not null
#
# Indexes
#
#  index_campaign_encounters_on_campaign_id                   (campaign_id)
#  index_campaign_encounters_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_encounters_on_quest_id                      (quest_id)
#  index_campaign_encounters_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (quest_id => campaign_quests.id) ON DELETE => cascade
#

# One of a quest's encounters: a fight, a talk, a puzzle or a trap along the
# way. It links the monsters in it (DM Guru's SRD and the DM's own, or book
# references to monsters) with how many of each, the NPCs the party meets
# there, and its reward items with how many (DM Guru's SRD, or any other book
# reference). It has its own maps (Foundry scenes) and reward coins and XP.
#
# Encounters are synced on their own (not as part of their quest), so one
# deleted with its quest leaves a tombstone too.
class CampaignEncounter < ApplicationRecord
  include CampaignRecord
  include MapsAndCoins

  KINDS = %w[combat social exploration puzzle trap other].freeze
  MAX_POSITION = 9999

  belongs_to :quest, class_name: 'CampaignQuest', inverse_of: :encounters
  has_many :links, -> { order(:position, :id) }, class_name: 'CampaignEncounterLink', foreign_key: :encounter_id,
                                                 inverse_of: :encounter, dependent: :destroy

  validates :name, presence: true, length: { maximum: 120 }
  validates :kind, inclusion: { in: KINDS }
  validates :position, numericality: { only_integer: true, in: 0..MAX_POSITION }
  validates :reward_xp, numericality: { only_integer: true, in: 0..CampaignQuest::MAX_XP }, allow_nil: true
  validates_same_campaign :quest
  foundry_scene_list :foundry_scenes
  coin_purse :reward_currency

  # An encounter is in its quest's campaign
  before_validation { self.campaign ||= quest&.campaign }

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      questId: quest_id&.to_s,
      name: name,
      kind: kind,
      description: description,
      notes: notes,
      position: position,
      foundryScenes: foundry_scenes,
      rewardCurrency: reward_currency,
      rewardXp: reward_xp,
      links: links.select(&:linkable).map(&:as_json_for_api)
    }
  end

  private

  # Not when the whole campaign goes
  def destroyed_without_tombstone?
    destroyed_by_association&.active_record == Campaign
  end
end
