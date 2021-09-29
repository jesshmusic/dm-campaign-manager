# == Schema Information
#
# Table name: multi_action_attacks
#
#  id                    :bigint           not null, primary key
#  name                  :string
#  num_attacks           :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  multiattack_action_id :bigint           not null
#
# Indexes
#
#  index_multi_action_attacks_on_multiattack_action_id  (multiattack_action_id)
#
# Foreign Keys
#
#  fk_rails_...  (multiattack_action_id => multiattack_actions.id)
#
require 'rails_helper'

RSpec.describe MultiActionAttack, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
