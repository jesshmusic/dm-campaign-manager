# == Schema Information
#
# Table name: characters
#
#  id                 :bigint           not null, primary key
#  alignment          :string
#  armor_class        :integer
#  character_type     :string           not null
#  charisma           :integer
#  constitution       :integer
#  copper_pieces      :integer
#  description        :text
#  dexterity          :integer
#  electrum_pieces    :integer
#  gold_pieces        :integer
#  hit_points         :integer
#  hit_points_current :integer
#  initiative         :integer
#  intelligence       :integer
#  languages          :string
#  level              :integer
#  name               :string           not null
#  platinum_pieces    :integer
#  proficiency        :integer
#  race               :string
#  role               :string
#  silver_pieces      :integer
#  slug               :string           not null
#  speed              :string
#  spell_ability      :string
#  spell_attack_bonus :integer
#  spell_save_dc      :integer
#  strength           :integer
#  wisdom             :integer
#  xp                 :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  campaign_id        :bigint
#  user_id            :bigint
#
# Indexes
#
#  index_characters_on_campaign_id  (campaign_id)
#  index_characters_on_slug         (slug)
#  index_characters_on_user_id      (user_id)
#

FactoryBot.define do
  factory :character do
    
  end
end
