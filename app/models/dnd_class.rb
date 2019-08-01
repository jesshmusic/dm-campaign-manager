# == Schema Information
#
# Table name: dnd_classes
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  hit_die    :integer
#  name       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class DndClass < ApplicationRecord
  has_many :spell_classes
  has_many :spells, through: :spell_classes
  
  has_many :proficiency_classes
  has_many :profieciencies, through: :proficiency_classes
end
