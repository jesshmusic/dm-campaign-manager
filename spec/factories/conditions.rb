# == Schema Information
#
# Table name: conditions
#
#  widgetId          :bigint           not null, primary key
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
    index { "MyString" }
    name { "MyString" }
  end
end
