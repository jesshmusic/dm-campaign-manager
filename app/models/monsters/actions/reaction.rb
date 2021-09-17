# == Schema Information
#
# Table name: reactions
#
#  id              :bigint           not null, primary key
#  attack_bonus    :integer
#  dc_type         :string
#  dc_value        :string
#  desc            :string
#  name            :string
#  success_type    :string
#  usage_dice      :string
#  usage_min_value :integer
#  usage_type      :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  monster_id      :bigint           not null
#
# Indexes
#
#  index_reactions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
class Reaction < ApplicationRecord
  belongs_to :monster
  has_many :action_damages, dependent: :destroy
end
