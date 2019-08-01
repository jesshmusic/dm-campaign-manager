# == Schema Information
#
# Table name: spells
#
#  id            :bigint           not null, primary key
#  api_url       :string
#  casting_time  :string
#  components    :text             default([]), is an Array
#  concentration :boolean
#  description   :text
#  duration      :text
#  higher_level  :text
#  level         :integer
#  material      :text
#  name          :text
#  page          :text
#  range         :text
#  ritual        :boolean
#  school        :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Spell < ApplicationRecord
  has_many :spell_classes
  has_many :dnd_classes, through: :spell_classes
end
