# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer
#  challenge_rating       :string
#  charisma               :integer
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution           :integer
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity              :integer
#  dexterity_save         :integer
#  hit_dice               :string
#  hit_points             :integer
#  intelligence           :integer
#  intelligence_save      :integer
#  languages              :string
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  reactions              :text
#  senses                 :string
#  size                   :string
#  skills                 :jsonb            is an Array
#  slug                   :string
#  speed                  :string
#  strength               :integer
#  strength_save          :integer
#  wisdom                 :integer
#  wisdom_save            :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :bigint
#
# Indexes
#
#  index_monsters_on_slug     (slug) UNIQUE
#  index_monsters_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

FactoryBot.define do
  factory :monster do
    name { "MyString" }
    size { "MyString" }
    type { "" }
    subtype { "MyString" }
    alignment { "MyString" }
    armor_class { 1 }
    hit_points { 1 }
    hit_dice { "MyString" }
    speed { "MyString" }
    strength { 1 }
    dexterity { 1 }
    constitution { 1 }
    intelligence { 1 }
    wisdom { 1 }
    charisma { 1 }
    damage_vulnerabilities { "MyString" }
    damage_resistances { "MyString" }
    damage_immunities { "MyString" }
    condition_immunities { "MyString" }
    senses { "MyString" }
    languages { "MyString" }
    challenge_rating { 1 }
    api_url { "MyString" }
  end
end
