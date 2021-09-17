# == Schema Information
#
# Table name: action_damages
#
#  id                  :bigint           not null, primary key
#  damage_bonus        :integer
#  damage_type         :string
#  dice_count          :integer
#  dice_value          :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  action_id           :bigint
#  legendary_action_id :bigint
#  reaction_id         :bigint
#  special_ability_id  :bigint
#
# Indexes
#
#  index_action_damages_on_action_id            (action_id)
#  index_action_damages_on_legendary_action_id  (legendary_action_id)
#  index_action_damages_on_reaction_id          (reaction_id)
#  index_action_damages_on_special_ability_id   (special_ability_id)
#
FactoryBot.define do
  factory :action_damage do
    dice_count { 1 }
    dice_value { 1 }
    damage_bonus { 1 }
    action { nil }
    damage_type { "MyString" }
  end
end
