# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_quest_links
#
#  id            :bigint           not null, primary key
#  linkable_type :string           not null
#  position      :integer          default(0), not null
#  quantity      :integer
#  sync_version  :bigint           default(0), not null
#  uuid          :uuid             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  linkable_id   :bigint           not null
#  quest_id      :bigint           not null
#
# Indexes
#
#  index_campaign_quest_links_on_linkable  (linkable_type,linkable_id)
#  index_campaign_quest_links_on_quest_id  (quest_id)
#  index_campaign_quest_links_on_uuid      (uuid) UNIQUE
#  index_campaign_quest_links_uniqueness   (quest_id,linkable_type,linkable_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (quest_id => campaign_quests.id) ON DELETE => cascade
#

# Something a quest involves: an NPC from the campaign, or a reward item (DM
# Guru's SRD, or a book reference that isn't a monster) with how many.
# Monsters go in the quest's encounters (CampaignEncounterLink).
class CampaignQuestLink < ApplicationRecord
  include CampaignLink

  CAMPAIGN_TYPES = %w[CampaignNpc CampaignReference].freeze
  LINKABLE_TYPES = (CAMPAIGN_TYPES + %w[Item]).freeze

  belongs_to :quest, class_name: 'CampaignQuest', inverse_of: :links
  linked_from :quest
  validate :not_a_monster

  private

  def not_a_monster
    return unless linkable_type == 'CampaignReference' && linkable.is_a?(CampaignReference) && linkable.category == 'monster'

    errors.add(:linkable, "is a monster: monsters go in the quest's encounters")
  end
end
