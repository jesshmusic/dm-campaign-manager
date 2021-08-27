# == Schema Information
#
# Table name: conditions
#
#  id          :bigint           not null, primary key
#  description :string           default([]), is an Array
#  index       :string
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
require 'rails_helper'

RSpec.describe Condition, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
