# == Schema Information
#
# Table name: speeds
#
#  widgetId         :bigint           not null, primary key
#  name       :string
#  value      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint           not null
#
# Indexes
#
#  index_speeds_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.widgetId)
#
class Speed < ApplicationRecord
  belongs_to :monster
end
