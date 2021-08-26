# == Schema Information
#
# Table name: senses
#
#  id                 :bigint           not null, primary key
#  blindsight         :string
#  darkvision         :string
#  passive_perception :integer
#  tremorsense        :string
#  truesight          :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  monster_id         :bigint           not null
#
# Indexes
#
#  index_senses_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
class Sense < ApplicationRecord
  belongs_to :monster
end
