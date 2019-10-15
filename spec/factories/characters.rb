# == Schema Information
#
# Table name: characters
#
#  id                   :bigint           not null, primary key
#  alignment            :string           default("neutral")
#  armor_class          :integer          default(10), not null
#  armor_class_modifier :integer          default(0), not null
#  background           :string           default("Acolyte")
#  charisma             :integer          default(10), not null
#  constitution         :integer          default(10), not null
#  copper_pieces        :integer          default(0)
#  description          :text             default("Enter this character's backstory, history, or notes here.")
#  dexterity            :integer          default(10), not null
#  electrum_pieces      :integer          default(0)
#  gold_pieces          :integer          default(0)
#  hit_points           :integer          default(8), not null
#  hit_points_current   :integer          default(8), not null
#  initiative           :integer          default(0), not null
#  intelligence         :integer          default(10), not null
#  languages            :string           default("Common")
#  name                 :string           not null
#  platinum_pieces      :integer          default(0)
#  proficiency          :integer          default(2)
#  role                 :string           default("Player Character")
#  silver_pieces        :integer          default(0), not null
#  slug                 :string           not null
#  speed                :string           default("30 feet"), not null
#  status               :integer          default("alive"), not null
#  strength             :integer          default(10), not null
#  type                 :string
#  wisdom               :integer          default(10), not null
#  xp                   :integer          default(0), not null
#  created_at           :datetime         not null
#  updated_at           :datetime         not null
#  armor_id             :integer
#  guild_id             :bigint
#  race_id              :integer          default(1), not null
#  shield_id            :integer
#  weapon_2h_id         :integer
#  weapon_lh_id         :integer
#  weapon_rh_id         :integer
#
# Indexes
#
#  index_characters_on_guild_id  (guild_id)
#  index_characters_on_slug      (slug)
#
# Foreign Keys
#
#  fk_rails_...  (guild_id => guilds.id)
#

FactoryBot.define do
  factory :character do
    
  end
end
