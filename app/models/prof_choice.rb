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
#
# Indexes
#
#  index_prof_choices_on_name  (name) UNIQUE
#

class ProfChoice < ApplicationRecord
  has_many :prof_choice_profs, dependent: :delete_all
  has_many :profs, through: :prof_choice_profs
end
