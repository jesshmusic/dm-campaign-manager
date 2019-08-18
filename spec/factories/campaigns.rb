# == Schema Information
#
# Table name: campaigns
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  world       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_campaigns_on_slug     (slug) UNIQUE
#  index_campaigns_on_user_id  (user_id)
#

FactoryBot.define do
  factory :campaign do
    name { Faker::TvShows::GameOfThrones.city }
    description { Faker::Movies::HarryPotter.quote }
    world { Faker::Movies::LordOfTheRings.location }
  end
end
