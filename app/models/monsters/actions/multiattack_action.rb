# == Schema Information
#
# Table name: multiattack_actions
#
#  id            :bigint           not null, primary key
#  desc          :string
#  name          :string
#  total_attacks :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  monster_id    :bigint           not null
#
# Indexes
#
#  index_multiattack_actions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
class MultiattackAction < ApplicationRecord
  belongs_to :monster

  has_many :multi_action_attacks, dependent: :destroy
end
