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

  has_many :multi_prof_choices, inverse_of: :multi_classing

  has_many :multi_classing_profs, dependent: :destroy
  has_many :profs, through: :multi_classing_profs

  has_many :multi_class_prereqs, dependent: :destroy
  has_one :multi_classing_prereq_option, inverse_of: :multi_classing
end
