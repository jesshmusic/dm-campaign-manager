# == Schema Information
#
# Table name: world_locations
#
#  id          :bigint           not null, primary key
#  description :text
#  map_x       :integer          default(0)
#  map_y       :integer          default(0)
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_world_locations_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

require 'rails_helper'

RSpec.describe WorldLocation, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
