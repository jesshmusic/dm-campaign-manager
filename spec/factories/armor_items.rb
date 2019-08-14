# == Schema Information
#
# Table name: items
#
#  id                          :bigint           not null, primary key
#  api_url                     :string
#  armor_class                 :integer
#  armor_dex_bonus             :boolean
#  armor_max_bonus             :integer
#  armor_stealth_disadvantage  :boolean
#  armor_str_minimum           :integer
#  category_range              :string
#  cost_unit                   :string
#  cost_value                  :integer
#  description                 :text
#  name                        :string
#  rarity                      :string
#  requires_attunement         :string
#  slug                        :string
#  sub_category                :string
#  type                        :string
#  vehicle_capacity            :string
#  vehicle_speed               :integer
#  vehicle_speed_unit          :string
#  weapon_2h_damage_dice_count :integer
#  weapon_2h_damage_dice_value :integer
#  weapon_2h_damage_type       :string
#  weapon_damage_dice_count    :integer
#  weapon_damage_dice_value    :integer
#  weapon_damage_type          :string
#  weapon_properties           :string           default([]), is an Array
#  weapon_range                :string
#  weapon_range_long           :integer
#  weapon_range_normal         :integer
#  weapon_thrown_range_long    :integer
#  weapon_thrown_range_normal  :integer
#  weight                      :integer
#  created_at                  :datetime         not null
#  updated_at                  :datetime         not null
#  user_id                     :bigint
#
# Indexes
#
#  index_items_on_slug     (slug) UNIQUE
#  index_items_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

FactoryBot.define do
  factory :armor_item do
    
  end
end
