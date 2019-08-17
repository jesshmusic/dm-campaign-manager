# == Schema Information
#
# Table name: events
#
#  id           :bigint           not null, primary key
#  description  :text
#  name         :string
#  when         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  adventure_id :bigint
#  campaign_id  :bigint
#  encounter_id :bigint
#
# Indexes
#
#  index_events_on_adventure_id  (adventure_id)
#  index_events_on_campaign_id   (campaign_id)
#  index_events_on_encounter_id  (encounter_id)
#
# Foreign Keys
#
#  fk_rails_...  (adventure_id => adventures.id)
#  fk_rails_...  (campaign_id => campaigns.id)
#  fk_rails_...  (encounter_id => encounters.id)
#

require 'rails_helper'

RSpec.describe Event, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
