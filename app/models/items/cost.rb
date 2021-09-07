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
class Cost < ApplicationRecord
  belongs_to :item
end
