# == Schema Information
#
# Table name: actions
#
#  id              :bigint           not null, primary key
#  attack_bonus    :integer
#  dc_ability      :string
#  dc_success_type :string
#  dc_value        :integer
#  desc            :string
#  name            :string
#  type            :string
#  usage_dice      :string
#  usage_min_value :integer
#  usage_type      :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  monster_id      :bigint           not null
#
# Indexes
#
#  index_actions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
class SpecialAbility < Action
  belongs_to :monster
  has_many :action_damages, dependent: :destroy
end
