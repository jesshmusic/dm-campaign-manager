# == Schema Information
#
# Table name: races
#
#  id                           :bigint           not null, primary key
#  ability_bonus_option_choices :string           default([]), is an Array
#  ability_bonus_options        :integer
#  age                          :text
#  alignment                    :text
#  charisma_modifier            :integer          default(0), not null
#  constitution_modifier        :integer          default(0), not null
#  dexterity_modifier           :integer          default(0), not null
#  intelligence_modifier        :integer          default(0), not null
#  language_choices             :string           default([]), is an Array
#  language_description         :text
#  languages                    :string           default([]), is an Array
#  name                         :string           default("New Race..."), not null
#  size                         :string
#  size_description             :text
#  slug                         :string           not null
#  speed                        :integer
#  starting_languages           :integer
#  strength_modifier            :integer          default(0), not null
#  subraces                     :string           default([]), is an Array
#  traits                       :jsonb            is an Array
#  wisdom_modifier              :integer          default(0), not null
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  user_id                      :bigint
#
# Indexes
#
#  index_races_on_name     (name)
#  index_races_on_slug     (slug)
#  index_races_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

FactoryBot.define do
  factory :race do
    name { Faker::Games::ElderScrolls.race }
    speed { "30 feet" }
    strength_modifier { Faker::Number.between(from: 0, to: 2) }
    dexterity_modifier { Faker::Number.between(from: 0, to: 2) }
    constitution_modifier { Faker::Number.between(from: 0, to: 2) }
    intelligence_modifier { Faker::Number.between(from: 0, to: 2) }
    wisdom_modifier { Faker::Number.between(from: 0, to: 2) }
    charisma_modifier { Faker::Number.between(from: 0, to: 2) }
  end
end
