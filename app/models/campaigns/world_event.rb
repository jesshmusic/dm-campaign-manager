# frozen_string_literal: true

# == Schema Information
#
# Table name: world_events
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  when        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_world_events_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

class WorldEvent < ApplicationRecord
  belongs_to :campaign
end
