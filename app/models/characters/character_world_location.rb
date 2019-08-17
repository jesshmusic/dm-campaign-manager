# frozen_string_literal: true

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

class CharacterWorldLocation < ApplicationRecord
  belongs_to :world_location
  belongs_to :character
end
