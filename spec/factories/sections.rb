# == Schema Information
#
# Table name: sections
#
#  id          :bigint           not null, primary key
#  description :string
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
FactoryBot.define do
  factory :section do
    name { "MyString" }
    description { "MyString" }
    slug { "MyString" }
  end
end
