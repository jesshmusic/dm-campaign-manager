# == Schema Information
#
# Table name: dnd_class_levels
#
#  widgetId                    :bigint           not null, primary key
#  ability_score_bonuses :integer
#  level                 :integer
#  prof_bonus            :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  dnd_class_id          :bigint           not null
#
# Indexes
#
#  index_dnd_class_levels_on_dnd_class_id  (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_id => dnd_classes.widgetId)
#
FactoryBot.define do
  factory :dnd_class_level do
    ability_score_bonuses { 1 }
    dnd_class { nil }
    level { 1 }
    prof_bonus { 1 }
  end
end
