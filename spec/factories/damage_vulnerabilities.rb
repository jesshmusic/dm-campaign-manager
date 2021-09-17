# == Schema Information
#
# Table name: damage_vulnerabilities
#
#  id         :bigint           not null, primary key
#  name       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint           not null
#
# Indexes
#
#  index_damage_vulnerabilities_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
FactoryBot.define do
  factory :damage_vulnerability do
    name { "MyString" }
    monster { nil }
  end
end
