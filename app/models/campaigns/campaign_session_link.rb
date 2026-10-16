# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_session_links
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
# from the campaign, or a monster or item from the compendium. Treasure (such
# as a book reference to a magic item) can say how many the session gives.
class CampaignSessionLink < ApplicationRecord
  include CampaignLink

  CAMPAIGN_TYPES = %w[CampaignSecret CampaignLocation CampaignNpc CampaignQuest CampaignFront CampaignReference].freeze
  LINKABLE_TYPES = (CAMPAIGN_TYPES + COMPENDIUM_TYPES).freeze

  belongs_to :session, class_name: 'CampaignSession', inverse_of: :links
  linked_from :session
end
