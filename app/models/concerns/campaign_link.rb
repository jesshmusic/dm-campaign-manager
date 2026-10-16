# frozen_string_literal: true

# A link from a session or quest to a record from its campaign, or to a
# monster or item from the compendium, with how many (for treasure and
# rewards). Links are synced as part of what owns them, so changing one bumps
# its owner's sync version (unless the owner itself is being deleted).
#
# Including classes define CAMPAIGN_TYPES and LINKABLE_TYPES and belong to
# their owner, then name it with `linked_from :session`.
module CampaignLink
  extend ActiveSupport::Concern
  include CampaignSyncable

  COMPENDIUM_TYPES = %w[Monster Item].freeze
  MAX_QUANTITY = 9999

  included do
    belongs_to :linkable, polymorphic: true
  end

  class_methods do
    def linked_from(owner)
      validates :linkable_type, inclusion: { in: self::LINKABLE_TYPES }
      validates :linkable_id, uniqueness: { scope: [:"#{owner}_id", :linkable_type], message: "is already linked to this #{owner}" }
      validates :quantity, numericality: { only_integer: true, in: 1..MAX_QUANTITY }, allow_nil: true
      validate :linkable_available

      after_destroy :bump_owner_sync_version,
                    unless: -> { destroyed_by_association&.active_record == self.class.reflect_on_association(owner).klass }
      after_save :bump_owner_sync_version

      define_method(:link_owner) { public_send(owner) }
    end
  end

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      linkableType: linkable_type,
      linkableId: linkable_id.to_s,
      name: linkable.respond_to?(:name) ? linkable.name : linkable.try(:text),
      slug: linkable.try(:slug),
      detail: detail,
      position: position,
      quantity: quantity
    }
  end

  private

  # Shown next to the name: a book reference's citation, a monster's CR, an item's rarity
  def detail
    return linkable.citation if linkable.respond_to?(:citation)
    return "CR #{linkable.challenge_rating}" if linkable.is_a?(Monster) && linkable.challenge_rating.present?

    linkable.try(:rarity).presence
  end

  def sync_campaign
    link_owner.campaign
  end

  def bump_owner_sync_version
    link_owner.save!
  end

  # Campaign records must come from the owner's campaign; compendium entries
  # must be SRD or the DM's own homebrew.
  def linkable_available
    return unless self.class::LINKABLE_TYPES.include?(linkable_type)
    return if linkable.nil? || link_owner.nil?

    available = if self.class::CAMPAIGN_TYPES.include?(linkable_type)
                  linkable.campaign_id == link_owner.campaign_id
                else
                  linkable.user_id.nil? || linkable.user_id == link_owner.campaign.user_id
                end
    errors.add(:linkable, 'is not available to this campaign') unless available
  end
end
