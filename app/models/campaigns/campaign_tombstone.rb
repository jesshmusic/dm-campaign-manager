# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_tombstones
#
#  id           :bigint           not null, primary key
#  record_type  :string           not null
#  record_uuid  :uuid             not null
#  sync_version :bigint           not null
#  created_at   :datetime         not null
#  campaign_id  :bigint           not null
#
# Indexes
#
#  index_campaign_tombstones_on_campaign_id                   (campaign_id)
#  index_campaign_tombstones_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id) ON DELETE => cascade
#

# Records a deleted planner record so a Foundry module syncing "changes since
# version N" learns about the deletion.
class CampaignTombstone < ApplicationRecord
  belongs_to :campaign
end
