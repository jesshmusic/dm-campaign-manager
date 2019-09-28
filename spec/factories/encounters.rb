# == Schema Information
#
# Table name: encounters
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer          default(0)
#  description     :text
#  electrum_pieces :integer          default(0)
#  gold_pieces     :integer          default(0)
#  location        :string           default("New Location"), not null
#  name            :string           default("New Encounter")
#  platinum_pieces :integer          default(0)
#  silver_pieces   :integer          default(0)
#  sort            :integer          default(0), not null
#  xp              :integer          default(0)
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  adventure_id    :bigint
#
# Indexes
#
#  index_encounters_on_adventure_id  (adventure_id)
#
# Foreign Keys
#
#  fk_rails_...  (adventure_id => adventures.id)
#

FactoryBot.define do
  factory :encounter do
    name { "MyString" }
    description { "MyText" }
    platinum_pieces { 1 }
    gold_pieces { 1 }
    electrum_pieces { 1 }
    silver_pieces { 1 }
    copper_pieces { 1 }
    xp { 1 }
  end
end
