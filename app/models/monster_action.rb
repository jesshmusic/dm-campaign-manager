# == Schema Information
#
# Table name: monster_actions
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  action_id  :bigint
#  monster_id :bigint
#
# Indexes
#
#  index_monster_actions_on_action_id   (action_id)
#  index_monster_actions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (action_id => actions.id)
#  fk_rails_...  (monster_id => monsters.id)
#

class MonsterAction < ApplicationRecord
  belongs_to :monster
  belongs_to :action
end
