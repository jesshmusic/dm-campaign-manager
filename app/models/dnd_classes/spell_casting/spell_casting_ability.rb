# == Schema Information
#
# Table name: spell_casting_abilities
#
#  widgetId               :bigint           not null, primary key
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  ability_score_id :bigint           not null
#  spell_casting_id :bigint           not null
#
# Indexes
#
#  index_spell_casting_abilities_on_ability_score_id  (ability_score_id)
#  index_spell_casting_abilities_on_spell_casting_id  (spell_casting_id)
#
# Foreign Keys
#
#  fk_rails_...  (ability_score_id => ability_scores.widgetId)
#  fk_rails_...  (spell_casting_id => spell_castings.widgetId)
#
class SpellCastingAbility < ApplicationRecord
  belongs_to :spell_casting
  belongs_to :ability_score
end
