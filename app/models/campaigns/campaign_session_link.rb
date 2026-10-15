# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_session_links
#
#  id            :bigint           not null, primary key
#  linkable_type :string           not null
#  position      :integer          default(0), not null
#  sync_version  :bigint           default(0), not null
#  uuid          :uuid             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  linkable_id   :bigint           not null
#  session_id    :bigint           not null
#
# Indexes
#
#  index_campaign_session_links_on_linkable    (linkable_type,linkable_id)
#  index_campaign_session_links_on_session_id  (session_id)
#  index_campaign_session_links_on_uuid        (uuid) UNIQUE
#  index_campaign_session_links_uniqueness     (session_id,linkable_type,linkable_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (session_id => campaign_sessions.id) ON DELETE => cascade
#

# Something the DM preps for a session: a secret, location, NPC, quest or front
# from the campaign, or a monster or item from the compendium.
class CampaignSessionLink < ApplicationRecord
  include CampaignSyncable

  CAMPAIGN_TYPES = %w[CampaignSecret CampaignLocation CampaignNpc CampaignQuest CampaignFront CampaignReference].freeze
  COMPENDIUM_TYPES = %w[Monster Item].freeze
  LINKABLE_TYPES = (CAMPAIGN_TYPES + COMPENDIUM_TYPES).freeze

  belongs_to :session, class_name: 'CampaignSession', inverse_of: :links
  belongs_to :linkable, polymorphic: true

  validates :linkable_type, inclusion: { in: LINKABLE_TYPES }
  validates :linkable_id, uniqueness: { scope: %i[session_id linkable_type], message: 'is already linked to this session' }
  validate :linkable_available

  after_destroy :bump_session_sync_version, unless: -> { destroyed_by_association&.active_record == CampaignSession }
  # A session's links are synced as part of the session, so changing them
  # bumps the session's version (unless the session itself is being deleted)
  after_save :bump_session_sync_version

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      linkableType: linkable_type,
      linkableId: linkable_id.to_s,
      name: linkable.respond_to?(:name) ? linkable.name : linkable.try(:text),
      slug: linkable.try(:slug),
      detail: linkable.try(:citation),
      position: position
    }
  end

  private

  def sync_campaign
    session.campaign
  end

  def bump_session_sync_version
    session.save!
  end

  # Campaign records must come from this session's campaign; compendium
  # entries must be SRD or the DM's own homebrew.
  def linkable_available
    return unless LINKABLE_TYPES.include?(linkable_type)
    return if linkable.nil? || session.nil?

    available = if CAMPAIGN_TYPES.include?(linkable_type)
                  linkable.campaign_id == session.campaign_id
                else
                  linkable.user_id.nil? || linkable.user_id == session.campaign.user_id
                end
    errors.add(:linkable, 'is not available to this campaign') unless available
  end
end
