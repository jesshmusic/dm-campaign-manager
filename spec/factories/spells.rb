# == Schema Information
#
# Table name: spells
#
#  id            :bigint           not null, primary key
#  name          :text
#  description   :text
#  higher_level  :text
#  page          :text
#  range         :text
#  components    :text             default([]), is an Array
#  material      :text
#  ritual        :boolean
#  duration      :text
#  concentration :boolean
#  casting_time  :string
#  level         :integer
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
