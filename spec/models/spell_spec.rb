# == Schema Information
#
# Table name: spells
#
#  id            :bigint           not null, primary key
#  name          :text
#  description   :text
#  higher_level  :text
#  page          :text
#  range         :text
#  components    :text             default([]), is an Array
#  material      :text
#  ritual        :boolean
#  duration      :text
#  concentration :boolean
#  casting_time  :string
#  level         :integer
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

require 'rails_helper'

RSpec.describe Spell, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
