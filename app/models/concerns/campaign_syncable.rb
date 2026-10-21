# frozen_string_literal: true

# Bookkeeping that lets a Foundry module pull "everything that changed in this
# campaign since version N" (see CAMPAIGN_PLANNER.md, two-way sync):
# - `uuid` is the record's stable id on both sides
# - `sync_version` comes from the campaign's counter and is bumped on every save
# - deleting a record (other than with its parent) leaves a CampaignTombstone
module CampaignSyncable
  extend ActiveSupport::Concern

  included do
    before_validation :assign_uuid, on: :create
    before_save :assign_sync_version
    after_destroy :record_tombstone, unless: :destroyed_without_tombstone?
  end

  private

  # A record deleted along with what owns it (its session, quest or campaign)
  # leaves no tombstone of its own: the owner's covers it
  def destroyed_without_tombstone?
    destroyed_by_association.present?
  end

  # The campaign whose counter versions this record
  def sync_campaign
    campaign
  end

  def assign_uuid
    self.uuid ||= SecureRandom.uuid
  end

  def assign_sync_version
    self.sync_version = sync_campaign.next_sync_version!
  end

  def record_tombstone
    CampaignTombstone.create!(
      campaign: sync_campaign,
      record_type: self.class.name,
      record_uuid: uuid,
      sync_version: sync_campaign.next_sync_version!
    )
  end
end
