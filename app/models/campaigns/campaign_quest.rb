# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_quests
#
#  id              :bigint           not null, primary key
#  act             :integer
#  description     :text
#  foundry_scenes  :jsonb            not null
#  kind            :string           default("main"), not null
#  level_max       :integer
#  level_min       :integer
#  milestone       :boolean          default(FALSE), not null
#  name            :string           not null
#  notes           :text
#  position        :integer          default(0), not null
#  reward          :text
#  reward_currency :jsonb            not null
#  reward_xp       :integer
#  status          :string           default("available"), not null
#  sync_version    :bigint           default(0), not null
#  uuid            :uuid             not null
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  campaign_id     :bigint           not null
#  giver_npc_id    :bigint
#  location_id     :bigint
#  parent_id       :bigint
#
# Indexes
#
#  index_campaign_quests_on_campaign_id                   (campaign_id)
#  index_campaign_quests_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_quests_on_giver_npc_id                  (giver_npc_id)
#  index_campaign_quests_on_location_id                   (location_id)
#  index_campaign_quests_on_parent_id                     (parent_id)
#  index_campaign_quests_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (giver_npc_id => campaign_npcs.id) ON DELETE => nullify
#  fk_rails_...  (location_id => campaign_locations.id) ON DELETE => nullify
#  fk_rails_...  (parent_id => campaign_quests.id) ON DELETE => nullify
#

# A main or side quest on the campaign's quest board. Main quests can be
# grouped into acts; any quest can nest under a parent quest.
#
# Besides its giver, a quest links to the NPCs involved, the monsters for its
# encounters and its reward items (with how many of each), and can use Foundry
# scenes as maps. Its reward is those items, coins, XP and/or a milestone
# ("level up when done"), plus the reward notes.
class CampaignQuest < ApplicationRecord
  include CampaignRecord
  include MapsAndCoins

  KINDS = %w[main side].freeze
  STATUSES = %w[available active completed failed].freeze
  MAX_XP = 1_000_000

  belongs_to :parent, class_name: 'CampaignQuest', optional: true
  belongs_to :giver_npc, class_name: 'CampaignNpc', optional: true
  belongs_to :location, class_name: 'CampaignLocation', optional: true
  has_many :links, -> { order(:position, :id) }, class_name: 'CampaignQuestLink', foreign_key: :quest_id,
                                                 inverse_of: :quest, dependent: :destroy

  validates :name, presence: true, length: { maximum: 120 }
  validates :kind, inclusion: { in: KINDS }
  validates :status, inclusion: { in: STATUSES }
  validates :act, numericality: { only_integer: true, in: 1..20 }, allow_nil: true
  validates :level_min, :level_max, numericality: { only_integer: true, in: 1..20 }, allow_nil: true
  validates :reward_xp, numericality: { only_integer: true, in: 0..MAX_XP }, allow_nil: true
  validates :milestone, inclusion: { in: [true, false], message: 'must be true or false' }
  validates_same_campaign :parent, :giver_npc, :location
  validates_acyclic_parent message: "can't be this quest or one of its sub-quests"
  linkable_from_sessions
  foundry_scene_list :foundry_scenes
  coin_purse :reward_currency
  validate :level_range_in_order

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      name: name,
      kind: kind,
      status: status,
      description: description,
      reward: reward,
      notes: notes,
      act: act,
      position: position,
      levelMin: level_min,
      levelMax: level_max,
      parentId: parent_id&.to_s,
      giverNpcId: giver_npc_id&.to_s,
      locationId: location_id&.to_s,
      foundryScenes: foundry_scenes,
      rewardCurrency: reward_currency,
      rewardXp: reward_xp,
      milestone: milestone,
      links: links.select(&:linkable).map(&:as_json_for_api)
    }
  end

  private

  def level_range_in_order
    return if level_min.blank? || level_max.blank? || level_max >= level_min

    errors.add(:level_max, "can't be lower than the minimum level")
  end
end
