# == Schema Information
#
# Table name: dnd_classes
#
#  id                  :bigint           not null, primary key
#  api_url             :string
#  hit_die             :integer
#  name                :text
#  proficiencies       :string           default([]), is an Array
#  proficiency_choices :jsonb            is an Array
#  saving_throws       :string           default([]), is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class DndClass < ApplicationRecord
  has_many :spell_classes
  has_many :spells, through: :spell_classes
end
