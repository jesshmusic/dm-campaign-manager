# == Schema Information
#
# Table name: magic_items
#
#  id                  :bigint           not null, primary key
#  description         :text
#  name                :string
#  rarity              :string
#  requires_attunement :boolean
#  type                :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

FactoryBot.define do
  factory :magic_item do
    name { "MyString" }
    type { "" }
    description { "MyText" }
    rarity { "MyString" }
    requires_attunement { false }
  end
end
