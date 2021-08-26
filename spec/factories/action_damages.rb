# == Schema Information
#
# Table name: action_damages
#
#  id                          :bigint           not null, primary key
#  damage_dice                 :string
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  monster_action_id           :bigint
#  monster_legendary_action_id :bigint
#  monster_special_ability_id  :bigint
#
# Indexes
#
#  index_action_damages_on_monster_action_id            (monster_action_id)
#  index_action_damages_on_monster_legendary_action_id  (monster_legendary_action_id)
#  index_action_damages_on_monster_special_ability_id   (monster_special_ability_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_action_id => monster_actions.id)
#  fk_rails_...  (monster_legendary_action_id => monster_legendary_actions.id)
#  fk_rails_...  (monster_special_ability_id => monster_special_abilities.id)
#
FactoryBot.define do
  factory :action_damage do
    damage_dice { "MyString" }
  end
end
