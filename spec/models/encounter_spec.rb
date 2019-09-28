# == Schema Information
#
# Table name: encounters
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer          default(0)
#  description     :text
#  electrum_pieces :integer          default(0)
#  gold_pieces     :integer          default(0)
#  location        :string           default("New Location"), not null
#  name            :string           default("New Encounter")
#  platinum_pieces :integer          default(0)
#  silver_pieces   :integer          default(0)
#  sort            :integer          default(0), not null
#  xp              :integer          default(0)
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

require 'rails_helper'

RSpec.describe Encounter, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
