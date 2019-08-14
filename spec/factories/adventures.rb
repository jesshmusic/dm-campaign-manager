# == Schema Information
#
# Table name: adventures
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
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
    name { "MyString" }
    description { "MyText" }
    campaign { nil }
  end
end
