# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_secrets
#
#  id                  :bigint           not null, primary key
#  position            :integer          default(0), not null
#  revealed_at         :datetime
#  revelation          :string
#  sync_version        :bigint           default(0), not null
#  text                :text             not null
#  uuid                :uuid             not null
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  campaign_id         :bigint           not null
#  revealed_session_id :bigint
#
# Indexes
#
#  index_campaign_secrets_on_campaign_id                   (campaign_id)
#  index_campaign_secrets_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_secrets_on_revealed_session_id           (revealed_session_id)
#  index_campaign_secrets_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (revealed_session_id => campaign_sessions.id) ON DELETE => nullify
#

# A secret or clue (Lazy DM step 4). Clues that point to the same conclusion
# share a `revelation` so the planner can check the Three Clue Rule.
# Unrevealed secrets carry forward from session to session.
class CampaignSecret < ApplicationRecord
  include CampaignRecord

  linkable_from_sessions

  belongs_to :revealed_session, class_name: 'CampaignSession', optional: true

  validates :text, presence: true, length: { maximum: 1000 }
  validates :revelation, length: { maximum: 120 }
  validates_same_campaign :revealed_session

  scope :unrevealed, -> { where(revealed_at: nil) }

  # A secret can't have been revealed in a session while it is still hidden
  before_validation { self.revealed_session = nil unless revealed? }

  def revealed?
    revealed_at.present?
  end

  def revealed=(value)
    revealed = ActiveModel::Type::Boolean.new.cast(value)
    self.revealed_at = revealed ? (revealed_at || Time.current) : nil
  end

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      text: text,
      revelation: revelation,
      revealed: revealed?,
      revealedAt: revealed_at&.iso8601,
      revealedSessionId: revealed_session_id&.to_s,
      position: position
    }
  end
end
