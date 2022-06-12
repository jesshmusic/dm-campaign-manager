# == Schema Information
#
# Table name: spell_castings
#
#  widgetId           :bigint           not null, primary key
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
#  fk_rails_...  (dnd_class_id => dnd_classes.widgetId)
#
class SpellCasting < ApplicationRecord
  belongs_to :dnd_class

  has_many :spell_casting_infos, dependent: :destroy

  has_one :spell_casting_ability, dependent: :destroy
  has_one :ability_score, -> { distinct }, through: :spell_casting_ability

  accepts_nested_attributes_for :spell_casting_infos, reject_if: :all_blank, allow_destroy: true
end
