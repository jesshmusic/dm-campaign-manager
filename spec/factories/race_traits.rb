# == Schema Information
#
# Table name: race_traits
#
#  widgetId         :bigint           not null, primary key
#  desc       :string           default([]), is an Array
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  race_id    :bigint           not null
#
# Indexes
#
#  index_race_traits_on_race_id  (race_id)
#
# Foreign Keys
#
#  fk_rails_...  (race_id => races.widgetId)
#
FactoryBot.define do
  factory :race_trait do
    name { "MyString" }
    desc { "MyString" }
    race { nil }
  end
end
