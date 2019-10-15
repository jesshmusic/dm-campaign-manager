# == Schema Information
#
# Table name: guilds
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_guilds_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

FactoryBot.define do
  factory :guild do
    name { "MyString" }
    description { "MyText" }
    campaign { nil }
  end
end
