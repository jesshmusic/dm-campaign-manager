# == Schema Information
#
# Table name: world_events
#
#  id          :bigint           not null, primary key
#  description :text
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

require 'rails_helper'

RSpec.describe WorldEvent, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
