# frozen_string_literal: true

# == Schema Information
#
# Table name: campaign_users
#
#  id          :bigint           not null, primary key
#  confirmed   :boolean
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#  user_id     :bigint
#
# Indexes
#
#  index_campaign_users_on_campaign_id  (campaign_id)
#  index_campaign_users_on_user_id      (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (user_id => users.id)
#

class CampaignUser < ApplicationRecord
  belongs_to :campaign
  belongs_to :user
end
