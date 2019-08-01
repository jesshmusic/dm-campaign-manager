# == Schema Information
#
# Table name: campaigns
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :text
#  world       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_campaigns_on_user_id  (user_id)
#

FactoryBot.define do
  factory :campaign do
    name { "MyText" }
    description { "MyText" }
    world { "MyText" }
  end
end
