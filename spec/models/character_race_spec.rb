# == Schema Information
#
# Table name: character_races
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  race_id      :bigint
#
# Indexes
#
#  index_character_races_on_character_id  (character_id)
#  index_character_races_on_race_id       (race_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (race_id => races.id)
#

require 'rails_helper'

RSpec.describe CharacterRace, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
