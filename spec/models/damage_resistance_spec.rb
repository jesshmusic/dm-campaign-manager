# == Schema Information
#
# Table name: damage_resistances
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint           not null
#
# Indexes
#
#  index_damage_resistances_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
require 'rails_helper'

RSpec.describe DamageResistance, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
