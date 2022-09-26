# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer          default(10)
#  attack_bonus           :integer
#  challenge_rating       :string
#  charisma               :integer          default(10), not null
#  condition_immunities   :string           default([]), is an Array
#  constitution           :integer          default(10), not null
#  damage_immunities      :string           default([]), is an Array
#  damage_resistances     :string           default([]), is an Array
#  damage_vulnerabilities :string           default([]), is an Array
#  dexterity              :integer          default(10), not null
#  hit_dice               :string
#  hit_points             :integer          default(8), not null
#  intelligence           :integer          default(10), not null
#  languages              :string
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  prof_bonus             :integer          default(2)
#  save_dc                :integer          default(13)
#  size                   :string
#  slug                   :string
#  strength               :integer          default(10), not null
#  wisdom                 :integer          default(10), not null
#  xp                     :integer
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

    it 'should return the slug for to_param' do
      monster = Monster.find_by(slug: 'orc')
      expect(monster).not_to be(nil)
      expect(monster.to_param).to eq('orc')
    end

    it 'should return a damage resistances/immunities' do
      monster = Monster.find_by(slug: 'lich')
      expect(monster.damage_resistances.count).to eq(3)
      expect(monster.damage_resistances.first.name).to eq('cold')
      expect(monster.damage_immunities.count).to eq(2)
      expect(monster.damage_immunities.first.name).to eq('poison')
    end

    it 'should have condition immunities' do
      monster = Monster.find_by(slug: 'lich')
      expect(monster.condition_immunities).not_to be(nil)
      expect(monster.condition_immunities.count).to eq(5)
      condition = Condition.find_by(name: 'Charmed')
      expect(condition).not_to be(nil)
      expect(condition.index).to eq('charmed')
      expect(condition.description).to eq(
                                         [
                                           '- A charmed creature can\'t attack the charmer or target the charmer with harmful abilities or magical effects.',
                                           '- The charmer has advantage on any ability check to interact socially with the creature.'
                                         ]
                                       )
    end

    it 'should should have api' do
      monster = Monster.find_by(slug: 'gargoyle')
      actions = monster.actions
      expect(actions.count).to eq(4)
      expect(actions[0].name).to eq('Multiattack')
      expect(actions[1].name).to eq('Bite')
    end

    it 'should should have legendary api' do
      monster = Monster.find_by(slug: 'ancient-red-dragon')
      actions = monster.legendary_actions
      expect(actions.count).to eq(3)
      expect(actions[0].name).to eq('Detect')
      expect(actions[2].name).to eq('Wing Attack (Costs 2 Actions)')
    end

    it 'should should have special abilities' do
      monster = Monster.find_by(slug: 'ancient-red-dragon')
      actions = monster.special_abilities
      expect(actions.count).to eq(1)
      expect(actions[0].name).to eq('Legendary Resistance')
    end
  end
end
