# == Schema Information
#
# Table name: locations
#
#  id           :bigint           not null, primary key
#  description  :text
#  map_x        :integer          default(0)
#  map_y        :integer          default(0)
#  name         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  adventure_id :bigint
#  campaign_id  :bigint
#  encounter_id :bigint
#
# Indexes
#
#  index_locations_on_adventure_id  (adventure_id)
#  index_locations_on_campaign_id   (campaign_id)
#  index_locations_on_encounter_id  (encounter_id)
#
# Foreign Keys
#
#  fk_rails_...  (adventure_id => adventures.id)
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (encounter_id => encounters.id)
#

FactoryBot.define do
  factory :world_location do
    name { Faker::Movies::LordOfTheRings.location }
    description { Faker::Movies::Hobbit.quote }
    map_x { 1 }
    map_y { 1 }
    campaign { nil }
  end
end
