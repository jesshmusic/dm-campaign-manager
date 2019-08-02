# == Schema Information
#
# Table name: monster_special_abilities
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  action_id  :bigint
#  monster_id :bigint
#
# Indexes
#
#  index_monster_special_abilities_on_action_id   (action_id)
#  index_monster_special_abilities_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (action_id => actions.id)
#  fk_rails_...  (monster_id => monsters.id)
#

require 'rails_helper'

RSpec.describe MonsterSpecialAbility, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
