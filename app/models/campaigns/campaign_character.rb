# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_characters
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  campaign_id  :bigint
#  character_id :bigint
#
# Indexes
#
#  index_campaign_characters_on_campaign_id   (campaign_id)
#  index_campaign_characters_on_character_id  (character_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (character_id => characters.id)
#

class CampaignCharacter < ApplicationRecord
  belongs_to :campaign
  belongs_to :character
end
