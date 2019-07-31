# == Schema Information
#
# Table name: campaigns
#
#  id          :bigint           not null, primary key
#  user_id     :bigint
#  name        :text
#  description :text
#  world       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

FactoryBot.define do
  factory :campaign do
    name { "MyText" }
    description { "MyText" }
    world { "MyText" }
  end
end
