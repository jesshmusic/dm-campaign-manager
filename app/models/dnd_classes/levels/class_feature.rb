# == Schema Information
#
# Table name: class_features
#
#  widgetId                 :bigint           not null, primary key
#  desc               :string           default([]), is an Array
#  level              :integer
#  name               :string
#  reference          :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  dnd_class_level_id :bigint           not null
#
# Indexes
#
#  index_class_features_on_dnd_class_level_id  (dnd_class_level_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_level_id => dnd_class_levels.widgetId)
#
class ClassFeature < ApplicationRecord
  belongs_to :dnd_class_level
  has_one :class_level_choice, dependent: :destroy
  has_one :expertise_options, class_name: 'ClassLevelChoice', dependent: :destroy
  has_one :subfeature_options, class_name: 'ClassLevelChoice', dependent: :destroy
  has_many :prerequisites, dependent: :destroy

  accepts_nested_attributes_for :class_level_choice, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :expertise_options, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :subfeature_options, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :prerequisites, reject_if: :all_blank, allow_destroy: true
end
