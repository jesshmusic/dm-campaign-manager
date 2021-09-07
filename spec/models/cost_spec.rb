# == Schema Information
#
# Table name: costs
#
#  id         :bigint           not null, primary key
#  quantity   :integer
#  unit       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  item_id    :bigint           not null
#
# Indexes
#
#  index_costs_on_item_id  (item_id)
#
# Foreign Keys
#
#  fk_rails_...  (item_id => items.id)
#
require 'rails_helper'

RSpec.describe Cost, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
