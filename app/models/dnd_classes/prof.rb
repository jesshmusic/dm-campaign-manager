# frozen_string_literal: true

# == Schema Information
#
# Table name: profs
#
#  id         :bigint           not null, primary key
#  name       :string
#  prof_type  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_profs_on_name  (name) UNIQUE
#

class Prof < ApplicationRecord
  validates :name, presence: true

  has_many :monster_proficiencies
  has_and_belongs_to_many :races
end
