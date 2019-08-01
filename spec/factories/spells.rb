# == Schema Information
#
# Table name: spells
#
#  id            :bigint           not null, primary key
#  api_url       :string
#  casting_time  :string
#  components    :text             default([]), is an Array
#  concentration :boolean
#  description   :text
#  duration      :text
#  higher_level  :text
#  level         :integer
#  material      :text
#  name          :text
#  page          :text
#  range         :text
#  ritual        :boolean
#  school        :text
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

FactoryBot.define do
  factory :spell do
    name { "MyText" }
    description { "MyText" }
    higher_level { "MyText" }
    page { "MyText" }
    range { "MyText" }
    components { "MyText" }
    material { "MyText" }
    ritual { false }
    duration { "MyText" }
    concentration { false }
    casting_time { "MyString" }
    level { 1 }
  end
end
