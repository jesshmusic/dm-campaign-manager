# == Schema Information
#
# Table name: spell_castings
#
#  id           :bigint           not null, primary key
#  level        :integer
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  dnd_class_id :bigint           not null
#
# Indexes
#
#  index_spell_castings_on_dnd_class_id  (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#
class SpellCasting < ApplicationRecord
  belongs_to :dnd_class

  has_many :spell_casting_infos, dependent: :destroy

  has_one :spell_casting_ability, dependent: :destroy
  has_one :ability_score, through: :spell_casting_ability
end
