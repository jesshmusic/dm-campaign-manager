# == Schema Information
#
# Table name: rules
#
#  id          :bigint           not null, primary key
#  category    :string
#  description :string
#  name        :string
#  slug        :string
#  subcategory :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_rules_on_parent_id  (parent_id)
#
FactoryBot.define do
  factory :rule do
    name { "MyString" }
    description { "MyString" }
    slug { "MyString" }
    string { "MyString" }
  end
end
