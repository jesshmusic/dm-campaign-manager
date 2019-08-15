# == Schema Information
#
# Table name: encounters
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer
#  description     :text
#  electrum_pieces :integer
#  gold_pieces     :integer
#  name            :string
#  platinum_pieces :integer
#  silver_pieces   :integer
#  xp              :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  adventure_id    :bigint
#
# Indexes
#
#  index_encounters_on_adventure_id  (adventure_id)
#
# Foreign Keys
#
#  fk_rails_...  (adventure_id => adventures.id)
#

class Encounter < ApplicationRecord
  has_many :encounter_monsters, inverse_of: :encounter
  has_many :equipment_items, inverse_of: :encounter

  accepts_nested_attributes_for :encounter_monsters, reject_if: :all_blank, allow_destroy: true
end
