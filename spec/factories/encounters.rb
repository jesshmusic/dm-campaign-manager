# == Schema Information
#
# Table name: encounters
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer
#  description     :text
#  electrum_pieces :integer
#  gold_pieces     :integer
#  name            :string
#  platinum_pieces :integer
#  silver_pieces   :integer
#  xp              :integer
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
