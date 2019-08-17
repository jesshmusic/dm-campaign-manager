# frozen_string_literal: true

# == Schema Information
#
# Table name: prof_choices
#
#  id               :bigint           not null, primary key
#  name             :string
#  num_choices      :integer
#  prof_choice_type :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  dnd_class_id     :bigint
#
# Indexes
#
#  index_prof_choices_on_dnd_class_id  (dnd_class_id)
#

class ProfChoice < ApplicationRecord
  validates :name, :num_choices, :prof_choice_type, presence: true

  has_many :prof_choice_profs, dependent: :destroy
  has_many :profs, through: :prof_choice_profs
  belongs_to :dnd_class, optional: true
end
