# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer          default(10)
#  challenge_rating       :string
#  charisma               :integer          default(10), not null
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution           :integer          default(10), not null
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity              :integer          default(10), not null
#  dexterity_save         :integer
#  hit_dice_modifier      :integer          default(0)
#  hit_dice_number        :integer          default(1), not null
#  hit_dice_value         :integer          default(8), not null
#  hit_points             :integer          default(8), not null
#  initiative             :integer          default(0), not null
#  intelligence           :integer          default(10), not null
#  intelligence_save      :integer
#  languages              :string
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  reactions              :text
#  senses                 :string
#  size                   :string
#  slug                   :string
#  speed                  :string           default("30 feet"), not null
#  strength               :integer          default(10), not null
#  strength_save          :integer
#  wisdom                 :integer          default(10), not null
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
