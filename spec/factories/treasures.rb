# == Schema Information
#
# Table name: treasures
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer
#  description     :text
#  electrum_pieces :integer
#  gold_pieces     :integer
#  name            :string
#  platinum_pieces :integer
#  silver_pieces   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  character_id    :bigint
#  user_id         :bigint
#
# Indexes
#
#  index_treasures_on_character_id  (character_id)
#  index_treasures_on_user_id       (user_id)
#

FactoryBot.define do
  factory :treasure do
    name { "MyString" }
    copper_pieces { 1 }
    silver_pieces { 1 }
    gold_pieces { 1 }
    platinum_pieces { 1 }
    slug { "MyString" }
  end
end
