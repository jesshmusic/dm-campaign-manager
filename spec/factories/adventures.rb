# frozen_string_literal: true

# == Schema Information
#
# Table name: adventures
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  sort        :integer          default(0), not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_adventures_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

FactoryBot.define do
  factory :adventure do
    name { Faker::TvShows::GameOfThrones.house }
    description { Faker::TvShows::GameOfThrones.quote }

    transient do
      encounters_count { rand(1..3) }
    end

    after(:create) do |adventure, evaluator|
      create_list(:encounter, evaluator.encounters_count, adventure: adventure)
    end
  end
end
