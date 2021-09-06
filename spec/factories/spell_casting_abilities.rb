# == Schema Information
#
# Table name: spell_casting_abilities
#
#  id               :bigint           not null, primary key
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
#  fk_rails_...  (ability_score_id => ability_scores.id)
#  fk_rails_...  (spell_casting_id => spell_castings.id)
#
FactoryBot.define do
  factory :spell_casting_ability do
    spell_casting { nil }
    ability_score { nil }
  end
end
