# == Schema Information
#
# Table name: damage_types
#
#  id               :bigint           not null, primary key
#  index            :string
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  action_damage_id :bigint           not null
#
# Indexes
#
#  index_damage_types_on_action_damage_id  (action_damage_id)
#
# Foreign Keys
#
#  fk_rails_...  (action_damage_id => action_damages.id)
#
require 'rails_helper'

RSpec.describe DamageType, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
