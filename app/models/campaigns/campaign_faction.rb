# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_factions
#
#  id           :bigint           not null, primary key
#  description  :text
#  goal         :text
#  name         :string           not null
#  notes        :text
#  sync_version :bigint           default(0), not null
#  uuid         :uuid             not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  campaign_id  :bigint           not null
#
# Indexes
#
#  index_campaign_factions_on_campaign_id                   (campaign_id)
#  index_campaign_factions_on_campaign_id_and_sync_version  (campaign_id,sync_version)
#  index_campaign_factions_on_uuid                          (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#
class CampaignFaction < ApplicationRecord
  include CampaignRecord

  has_many :npcs, class_name: 'CampaignNpc', foreign_key: :faction_id, inverse_of: :faction, dependent: nil

  validates :name, presence: true, length: { maximum: 120 }

  def as_json_for_api
    {
      id: id.to_s,
      uuid: uuid,
      name: name,
      description: description,
      goal: goal,
      notes: notes
    }
  end
end
