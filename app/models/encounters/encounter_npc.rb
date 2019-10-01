# frozen_string_literal: true

# == Schema Information
#
# Table name: encounter_npcs
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  encounter_id :bigint
#
# Indexes
#
#  index_encounter_npcs_on_character_id  (character_id)
#  index_encounter_npcs_on_encounter_id  (encounter_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (encounter_id => encounters.id)
#

class EncounterNpc < ApplicationRecord
  belongs_to :character
  belongs_to :encounter
end
