# == Schema Information
#
# Table name: speeds
#
#  id         :bigint           not null, primary key
#  burrow     :string
#  climb      :string
#  fly        :string
#  hover      :boolean
#  swim       :string
#  walk       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint           not null
#
# Indexes
#
#  index_speeds_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
FactoryBot.define do
  factory :speed do
    burrow { "MyString" }
    climb { "MyString" }
    fly { "MyString" }
    hover { false }
    swim { "MyString" }
    walk { "MyString" }
    monster { nil }
  end
end
