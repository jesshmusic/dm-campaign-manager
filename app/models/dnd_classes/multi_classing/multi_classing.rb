# == Schema Information
#
# Table name: multi_classings
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  dnd_class_id :bigint           not null
#
# Indexes
#
#  index_multi_classings_on_dnd_class_id  (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#
class MultiClassing < ApplicationRecord
  belongs_to :dnd_class

  has_many :multi_classing_profs, dependent: :destroy
  has_many :profs, through: :multi_classing_profs
  has_many :prof_choices, dependent: :destroy

  has_many :multi_class_prereqs, dependent: :destroy
  has_one :multi_classing_prereq_option, inverse_of: :multi_classing

  accepts_nested_attributes_for :prof_choices, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :multi_classing_prereq_option, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :multi_class_prereqs, reject_if: :all_blank, allow_destroy: true
end
