# == Schema Information
#
# Table name: proficiencies
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  name       :string
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Proficiency < ApplicationRecord
  has_many :proficiency_classes
  has_many :dnd_classes, through: :proficiency_classes
end
