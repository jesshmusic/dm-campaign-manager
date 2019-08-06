# == Schema Information
#
# Table name: treasures
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer
#  description     :text
#  gold_pieces     :integer
#  name            :string
#  platinum_pieces :integer
#  silver_pieces   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  monster_id      :bigint
#  user_id         :bigint
#
# Indexes
#
#  index_treasures_on_monster_id  (monster_id)
#  index_treasures_on_user_id     (user_id)
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
