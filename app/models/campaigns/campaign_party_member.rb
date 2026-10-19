# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_party_members
#
#  id                  :bigint           not null, primary key
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  campaign_id         :bigint           not null
#  player_character_id :bigint           not null
#
# Indexes
#
#  idx_on_campaign_id_player_character_id_c6c43d9df3    (campaign_id,player_character_id) UNIQUE
#  index_campaign_party_members_on_player_character_id  (player_character_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id) ON DELETE => cascade
#  fk_rails_...  (player_character_id => player_characters.id) ON DELETE => cascade
#

# A player character in a campaign's party
class CampaignPartyMember < ApplicationRecord
  belongs_to :campaign
  belongs_to :player_character

  validates :player_character_id, uniqueness: { scope: :campaign_id }
  validate :character_belongs_to_the_dm

  private

  def character_belongs_to_the_dm
    return if campaign.nil? || player_character.nil? || player_character.user_id == campaign.user_id

    errors.add(:player_character, 'must be one of your characters')
  end
end
