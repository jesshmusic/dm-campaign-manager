# == Schema Information
#
# Table name: actions
#
#  id              :bigint           not null, primary key
#  attack_bonus    :integer
#  dc_type         :string
#  dc_value        :integer
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
#  index_actions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
require 'rails_helper'

RSpec.describe Action, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
