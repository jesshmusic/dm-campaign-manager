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
class DndClassLevel < ApplicationRecord
  belongs_to :dnd_class

  has_many :class_features, dependent: :destroy
  has_many :class_specifics, dependent: :destroy
  has_one :class_spellcasting, dependent: :destroy

  accepts_nested_attributes_for :class_features, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :class_specifics, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :class_spellcasting, reject_if: :all_blank, allow_destroy: true
end
