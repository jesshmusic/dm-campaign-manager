# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_quests
#
#  id           :bigint           not null, primary key
#  act          :integer
#  description  :text
#  kind         :string           default("main"), not null
#  level_max    :integer
#  level_min    :integer
#  name         :string           not null
#  notes        :text
#  position     :integer          default(0), not null
#  reward       :text
#  status       :string           default("available"), not null
#  sync_version :bigint           default(0), not null
#  uuid         :uuid             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  campaign_id  :bigint           not null
#  giver_npc_id :bigint
#  location_id  :bigint
#  parent_id    :bigint
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
class CampaignQuest < ApplicationRecord
  include CampaignRecord

  KINDS = %w[main side].freeze
  STATUSES = %w[available active completed failed].freeze

  belongs_to :parent, class_name: 'CampaignQuest', optional: true
  belongs_to :giver_npc, class_name: 'CampaignNpc', optional: true
  belongs_to :location, class_name: 'CampaignLocation', optional: true

  validates :name, presence: true, length: { maximum: 120 }
  validates :kind, inclusion: { in: KINDS }
  validates :status, inclusion: { in: STATUSES }
  validates :act, numericality: { only_integer: true, in: 1..20 }, allow_nil: true
  validates :level_min, :level_max, numericality: { only_integer: true, in: 1..20 }, allow_nil: true
  validates_same_campaign :parent, :giver_npc, :location
  validates_acyclic_parent message: "can't be this quest or one of its sub-quests"
  linkable_from_sessions
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
      locationId: location_id&.to_s
    }
  end

  private

  def level_range_in_order
    return if level_min.blank? || level_max.blank? || level_max >= level_min

    errors.add(:level_max, "can't be lower than the minimum level")
  end
end
