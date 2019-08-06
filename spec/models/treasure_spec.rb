# == Schema Information
#
# Table name: treasures
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer
#  description     :text
#  gold_pieces     :integer
#  name            :string
#  platinum_pieces :integer
#  silver_pieces   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  monster_id      :bigint
#  user_id         :bigint
#
# Indexes
#
#  index_treasures_on_monster_id  (monster_id)
#  index_treasures_on_user_id     (user_id)
#

require 'rails_helper'

RSpec.describe Treasure, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
