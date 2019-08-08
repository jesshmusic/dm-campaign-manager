# == Schema Information
#
# Table name: character_stats
#
#  id                  :bigint           not null, primary key
#  alignment           :string
#  armor_class         :integer
#  charisma            :integer
#  constitution        :integer
#  copper_pieces       :integer
#  dexterity           :integer
#  gold_pieces         :integer
#  hit_points          :integer
#  hit_points_current  :integer
#  initiative          :integer
#  intelligence        :integer
#  languages           :string
#  level               :integer
#  platinum_pieces     :integer
#  proficiency         :integer
#  race                :string
#  silver_pieces       :integer
#  speed               :string
#  spell_ability       :string
#  spell_attack_bonus  :integer
#  spell_save_dc       :integer
#  strength            :integer
#  wisdom              :integer
#  xp                  :integer
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  player_character_id :bigint
#
# Indexes
#
#  index_character_stats_on_player_character_id  (player_character_id)
#

FactoryBot.define do
  factory :character_stat do
    level { 1 }
    alignment { "MyString" }
    armor_class { 1 }
    hit_points { 1 }
    strength { 1 }
    dexterity { 1 }
    constitution { 1 }
    intelligence { 1 }
    wisdom { 1 }
    charisma { 1 }
  end
end
