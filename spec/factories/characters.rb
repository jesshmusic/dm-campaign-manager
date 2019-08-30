# == Schema Information
#
# Table name: characters
#
#  id                 :bigint           not null, primary key
#  alignment          :string           default("neutral")
#  armor_class        :integer          default(10), not null
#  background         :string           default("Acolyte")
#  charisma           :integer          default(10), not null
#  constitution       :integer          default(10), not null
#  copper_pieces      :integer          default(0)
#  description        :text             default("Enter this character's backstory, history, or notes here.")
#  dexterity          :integer          default(10), not null
#  electrum_pieces    :integer          default(0)
#  gold_pieces        :integer          default(0)
#  hit_points         :integer          default(8), not null
#  hit_points_current :integer          default(8), not null
#  initiative         :integer          default(0), not null
#  intelligence       :integer          default(10), not null
#  languages          :string           default("Common")
#  name               :string           not null
#  platinum_pieces    :integer          default(0)
#  proficiency        :integer          default(2)
#  race               :string           default("Human"), not null
#  role               :string           default("Player Character")
#  silver_pieces      :integer          default(0), not null
#  slug               :string           not null
#  speed              :string           default("30 feet"), not null
#  strength           :integer          default(10), not null
#  type               :string
#  wisdom             :integer          default(10), not null
#  xp                 :integer          default(0), not null
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  user_id            :bigint
#
# Indexes
#
#  index_characters_on_slug     (slug)
#  index_characters_on_user_id  (user_id)
#

FactoryBot.define do
  factory :character do
    
  end
end
