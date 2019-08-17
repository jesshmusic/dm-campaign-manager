# == Schema Information
#
# Table name: character_world_locations
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  character_id      :bigint
#  world_location_id :bigint
#
# Indexes
#
#  index_character_world_locations_on_character_id       (character_id)
#  index_character_world_locations_on_world_location_id  (world_location_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (world_location_id => world_locations.id)
#

require 'rails_helper'

RSpec.describe CharacterWorldLocation, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
