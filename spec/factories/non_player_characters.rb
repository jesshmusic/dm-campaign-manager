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
#  campaign_id          :bigint
#  race_id              :integer          default(1), not null
#  shield_id            :integer
#  weapon_2h_id         :integer
#  weapon_lh_id         :integer
#  weapon_rh_id         :integer
#
# Indexes
#
#  index_characters_on_campaign_id  (campaign_id)
#  index_characters_on_slug         (slug)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

FactoryBot.define do
  factory :non_player_character do
    name { Faker::Games::ElderScrolls.name }
    type { 'NonPlayerCharacter' }
    alignment { DndRules.alignments.sample }
    armor_class { Faker::Number.between(from: 10, to: 25) }
    armor_class_modifier { [0, 0, 0, 0, 1, 1, 2].sample }
    strength { Faker::Number.between(from: 7, to: 22) }
    dexterity { Faker::Number.between(from: 7, to: 22) }
    constitution { Faker::Number.between(from: 7, to: 22) }
    intelligence { Faker::Number.between(from: 7, to: 22) }
    wisdom { Faker::Number.between(from: 7, to: 22) }
    charisma { Faker::Number.between(from: 7, to: 22) }
    role { ['Main Villain', 'Minor Villain', 'Lord', 'Ally'].sample }
    hit_points { Faker::Number.between(from: 12, to: 100) }

    before(:create) do |character|
      character.race_id = FactoryBot.create(:race, name: 'Human').id
      character.character_classes << FactoryBot.build(:character_class, character: character)
    end
  end
end
