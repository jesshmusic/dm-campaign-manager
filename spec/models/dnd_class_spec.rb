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

require 'rails_helper'

RSpec.describe DndClass, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
