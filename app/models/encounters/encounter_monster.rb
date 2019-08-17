# frozen_string_literal: true

# == Schema Information
#
# Table name: encounter_monsters
#
#  id                 :bigint           not null, primary key
#  number_of_monsters :integer          default(1)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  encounter_id       :bigint
#  monster_id         :bigint
#
# Indexes
#
#  index_encounter_monsters_on_encounter_id  (encounter_id)
#  index_encounter_monsters_on_monster_id    (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (encounter_id => encounters.id)
#  fk_rails_...  (monster_id => monsters.id)
#

class EncounterMonster < ApplicationRecord
  belongs_to :monster
  belongs_to :encounter
end
