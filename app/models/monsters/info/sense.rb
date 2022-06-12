# == Schema Information
#
# Table name: senses
#
#  widgetId         :bigint           not null, primary key
#  name       :string
#  value      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint           not null
#
# Indexes
#
#  index_senses_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.widgetId)
#
class Sense < ApplicationRecord
  belongs_to :monster
end
