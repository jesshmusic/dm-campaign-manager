# == Schema Information
#
# Table name: player_characters
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_player_characters_on_user_id  (user_id)
#

FactoryBot.define do
  factory :player_character do
    name { "MyString" }
    description { "MyText" }
    slug { "MyString" }
  end
end
