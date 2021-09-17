# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer          default(10)
#  challenge_rating       :string
#  charisma               :integer          default(10), not null
#  constitution           :integer          default(10), not null
#  damage_immunities      :string           default([]), is an Array
#  damage_resistances     :string           default([]), is an Array
#  damage_vulnerabilities :string           default([]), is an Array
#  dexterity              :integer          default(10), not null
#  hit_dice               :string
#  hit_points             :integer          default(8), not null
#  intelligence           :integer          default(10), not null
#  languages              :string
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  size                   :string
#  slug                   :string
#  strength               :integer          default(10), not null
#  wisdom                 :integer          default(10), not null
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :bigint
#
# Indexes
#
#  index_monsters_on_slug     (slug) UNIQUE
#  index_monsters_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe Monster, type: :model do
  context 'with the same name' do
    let!(:dungeon_master) { create :dungeon_master_user }

    def create_monsters
      @monster = Monster.create!(name: 'Goober Fish',
                                 hit_points: 10,
                                 alignment: 'Chaotic Neutral',
                                 monster_type: 'beast',
                                 challenge_rating: '1')
      @monster1 = Monster.create!(name: 'Goober Fish',
                                  hit_points: 10,
                                  alignment: 'Chaotic Neutral',
                                  monster_type: 'beast',
                                  challenge_rating: '1')
      @user_monster = Monster.create!(name: 'Goober Fish',
                                      hit_points: 20,
                                      user: dungeon_master,
                                      alignment: 'Chaotic Neutral',
                                      monster_type: 'beast',
                                      challenge_rating: '1')
    end

    it 'generates unique slugs' do
      create_monsters
      expect(@monster.slug).to eq('goober-fish')
      expect(@monster1.slug).to eq('goober-fish-1')
      expect(@user_monster.slug).to eq('goober-fish-jesshdm1')
    end

    it 'maintains same slug on update with no name change' do
      create_monsters
      expect(@monster.slug).to eq('goober-fish')
      @monster.update(hit_points: 12)
      expect(Monster.all.count).to eq(335)
      @monster.reload
      expect(@monster.slug).to eq('goober-fish')
      @monster.update(hit_points: 8)
      expect(Monster.all.count).to eq(335)
      @monster.reload
      expect(@monster.slug).to eq('goober-fish')
      @monster.update(hit_points: 12)
      expect(Monster.all.count).to eq(335)
      @monster.reload
      expect(@monster.slug).to eq('goober-fish')
    end

    it 'should have 332 monsters' do
      expect(Monster.all.count).to eq(332)
    end

    it 'should return the correct XP' do
      monster = Monster.find_by(slug: 'orc')
      expect(monster).not_to be(nil)
      expect(monster.xp).not_to be(nil)
      expect(monster.xp).to eq(100)
    end

    it 'should return the correct initiative modifier' do
      monster = Monster.find_by(slug: 'orc')
      expect(monster).not_to be(nil)
      expect(monster.initiative).not_to be(nil)
      expect(monster.initiative).to eq(1)
    end

    it 'should return a description text string' do
      monster = Monster.find_by(slug: 'orc')
      expect(monster).not_to be(nil)
      expect(monster.description_text).not_to be(nil)
      expect(monster.description_text).to include('<p><strong>Armor Class</strong>  13</p>')
      expect(monster.description_text).to include('<p><strong>Saving Throws </strong>')
      expect(monster.description_text).to include('<span>Intimidation +2 </span>')
      expect(monster.description_text).to include('Melee or Ranged Weapon Attack: +5 to hit, reach 5 ft. or range 30/120 ft., one target. Hit: 6 (1d6 + 3) piercing damage.')
      expect(monster.description_text).to include('Aggressive')
      expect(monster.description_text).to include('As a bonus action, the orc can move up to its speed toward a hostile creature that it can see.')
    end

    it 'should return a description text string for a higher level monster (lich)' do
      monster = Monster.find_by(slug: 'lich')
      expect(monster.description_text).not_to be(nil)
      expect(monster.description_text).to include('<span>Con +10 </span>, <span>Int +12 </span>, <span>Wis +9 </span>')
    end

    it 'should return the slug for to_param' do
      monster = Monster.find_by(slug: 'orc')
      expect(monster).not_to be(nil)
      expect(monster.to_param).to eq('orc')
    end

    it 'should return a damage resistances/immunities' do
      monster = Monster.find_by(slug: 'lich')
      expect(monster.description_text).not_to be(nil)
      expect(monster.damage_resistances).to eq(%w[cold lightning necrotic])
      expect(monster.damage_immunities).to eq([
                                                'poison',
                                                'bludgeoning, piercing, and slashing from nonmagical weapons'
                                              ])
    end

    it 'should have condition immunities' do
      monster = Monster.find_by(slug: 'lich')
      expect(monster.condition_immunities).not_to be(nil)
      expect(monster.condition_immunities.count).to eq(5)
      condition = Condition.find_by(name: 'Charmed')
      expect(condition).not_to be(nil)
      expect(condition.index).to eq('charmed')
      expect(condition.description).to eq([
                                            '- A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects.',
                                            '- The charmer has advantage on any ability check to interact socially with the creature.'
                                          ])
    end
  end
end
