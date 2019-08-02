# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer
#  challenge_rating       :integer
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
#  name                   :string
#  senses                 :string
#  size                   :string
#  skills                 :jsonb            is an Array
#  speed                  :string
#  strength               :integer
#  strength_save          :integer
#  subtype                :string
#  type                   :string
#  wisdom                 :integer
#  wisdom_save            :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
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
