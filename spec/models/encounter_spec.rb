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

require 'rails_helper'

RSpec.describe Encounter, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
