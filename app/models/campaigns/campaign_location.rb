# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_locations
#
#  id             :bigint           not null, primary key
#  description    :text
#  features       :jsonb            not null
#  name           :string           not null
#  notes          :text
#  sync_version   :bigint           default(0), not null
#  uuid           :uuid             not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  campaign_id    :bigint           not null
#  foundry_map_id :bigint
#  parent_id      :bigint
#
# Indexes
#
#  index_campaign_locations_on_campaign_id                   (campaign_id)
#  index_campaign_locations_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_locations_on_foundry_map_id                (foundry_map_id)
#  index_campaign_locations_on_parent_id                     (parent_id)
#  index_campaign_locations_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (foundry_map_id => foundry_maps.id) ON DELETE => nullify
#  fk_rails_...  (parent_id => campaign_locations.id) ON DELETE => nullify
#

# A fantastic location, optionally nested in a parent and linked to a
# Dorman Lakely Cartography map.
class CampaignLocation < ApplicationRecord
  include CampaignRecord

  MAX_FEATURES = 20

  belongs_to :parent, class_name: 'CampaignLocation', optional: true
  belongs_to :foundry_map, optional: true

  validates :name, presence: true, length: { maximum: 120 }
  validates_string_list :features, max: MAX_FEATURES
  validates_same_campaign :parent
  validates_acyclic_parent message: "can't be this location or one inside it"
  linkable_from_sessions

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      name: name,
      description: description,
      features: features,
      notes: notes,
      parentId: parent_id&.to_s,
      foundryMapId: foundry_map_id&.to_s
    }
  end
end
