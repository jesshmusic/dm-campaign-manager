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
class Condition < ApplicationRecord

  has_many :condition_immunities
end
