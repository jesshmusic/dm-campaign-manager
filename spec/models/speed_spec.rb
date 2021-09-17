# == Schema Information
#
# Table name: speeds
#
#  id         :bigint           not null, primary key
#  name       :string
#  value      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint           not null
#
# Indexes
#
#  index_speeds_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
require 'rails_helper'

RSpec.describe Speed, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
