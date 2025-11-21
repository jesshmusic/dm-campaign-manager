# == Schema Information
#
# Table name: conditions
#
#  id          :bigint           not null, primary key
#  description :string           default([]), is an Array
#  name        :string
#  slug        :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_conditions_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :condition do
    sequence(:name) { |n| "Condition #{n}" }
    description { ["A status condition affecting creatures"] }
  end
end
