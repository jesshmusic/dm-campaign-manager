# == Schema Information
#
# Table name: conditions
#
#  id          :bigint           not null, primary key
#  description :string           default([]), is an Array
#  index       :string
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  monster_id  :bigint
#
# Indexes
#
#  index_conditions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
FactoryBot.define do
  factory :condition do
    index { "MyString" }
    name { "MyString" }
  end
end
