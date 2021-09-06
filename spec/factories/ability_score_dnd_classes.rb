# == Schema Information
#
# Table name: ability_score_dnd_classes
#
#  id               :bigint           not null, primary key
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  ability_score_id :bigint           not null
#  dnd_class_id     :bigint           not null
#
# Indexes
#
#  index_ability_score_dnd_classes_on_ability_score_id  (ability_score_id)
#  index_ability_score_dnd_classes_on_dnd_class_id      (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (ability_score_id => ability_scores.id)
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#
FactoryBot.define do
  factory :ability_score_dnd_class do
    dnd_class { nil }
    ability_score { nil }
  end
end
