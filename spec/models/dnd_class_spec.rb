# == Schema Information
#
# Table name: dnd_classes
#
#  id                  :bigint           not null, primary key
#  api_url             :string
#  hit_die             :integer
#  name                :text
#  proficiencies       :string           default([]), is an Array
#  proficiency_choices :string           default([]), is an Array
#  saving_throws       :string           default([]), is an Array
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

require 'rails_helper'

RSpec.describe DndClass, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
