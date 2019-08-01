# == Schema Information
#
# Table name: proficiencies
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  name       :string
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :proficiency do
    name { "MyString" }
    type { "" }
    api_url { "MyString" }
  end
end
