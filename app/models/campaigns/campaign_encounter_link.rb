# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_encounter_links
#
#  id            :bigint           not null, primary key
#  linkable_type :string           not null
#  position      :integer          default(0), not null
#  quantity      :integer
#  sync_version  :bigint           default(0), not null
#  uuid          :uuid             not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  encounter_id  :bigint           not null
#  linkable_id   :bigint           not null
#
# Indexes
#
#  index_campaign_encounter_links_on_encounter_id  (encounter_id)
#  index_campaign_encounter_links_on_linkable      (linkable_type,linkable_id)
#  index_campaign_encounter_links_on_uuid          (uuid) UNIQUE
#  index_campaign_encounter_links_uniqueness       (encounter_id,linkable_type,linkable_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (encounter_id => campaign_encounters.id) ON DELETE => cascade
#

# Something in one of a quest's encounters: a monster with how many (DM
# Guru's SRD or the DM's own, or a book reference to a monster), an NPC from
# the campaign, or a reward item (DM Guru's SRD, or any other book reference)
# with how many.
class CampaignEncounterLink < ApplicationRecord
  include CampaignLink

  CAMPAIGN_TYPES = %w[CampaignNpc CampaignReference].freeze
  LINKABLE_TYPES = (CAMPAIGN_TYPES + COMPENDIUM_TYPES).freeze

  belongs_to :encounter, class_name: 'CampaignEncounter', inverse_of: :links
  linked_from :encounter
end
