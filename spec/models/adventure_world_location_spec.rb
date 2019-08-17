# == Schema Information
#
# Table name: adventure_world_locations
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  adventure_id      :bigint
#  world_location_id :bigint
#
# Indexes
#
#  index_adventure_world_locations_on_adventure_id       (adventure_id)
#  index_adventure_world_locations_on_world_location_id  (world_location_id)
#
# Foreign Keys
#
#  fk_rails_...  (adventure_id => adventures.id)
#  fk_rails_...  (world_location_id => world_locations.id)
#

require 'rails_helper'

RSpec.describe AdventureWorldLocation, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
