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
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution           :integer          default(10), not null
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity              :integer          default(10), not null
#  dexterity_save         :integer
#  hit_dice_modifier      :integer          default(0)
#  hit_dice_number        :integer          default(1), not null
#  hit_dice_value         :integer          default(8), not null
#  hit_points             :integer          default(8), not null
#  initiative             :integer          default(0), not null
#  intelligence           :integer          default(10), not null
#  intelligence_save      :integer
#  languages              :string
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  senses                 :string
#  size                   :string
#  slug                   :string
#  speed                  :string           default("30 feet"), not null
#  strength               :integer          default(10), not null
#  strength_save          :integer
#  wisdom                 :integer          default(10), not null
#  wisdom_save            :integer
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
  context "with the same name" do
    before(:each) do
      dungeon_master = FactoryBot.create(:dungeon_master_user)
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

    it "generates unique slugs" do
      expect(@monster.slug).to eq('goober-fish')
      expect(@monster1.slug).to eq('goober-fish-1')
      expect(@user_monster.slug).to eq('goober-fish-jesshdm')
    end

    it "maintains same slug on update with no name change" do
      expect(@monster.slug).to eq('goober-fish')
      @monster.update(hit_points: 12)
      expect(Monster.all.count).to eq(3)
      @monster.reload
      expect(@monster.slug).to eq('goober-fish')
      @monster.update(hit_points: 8)
      expect(Monster.all.count).to eq(3)
      @monster.reload
      expect(@monster.slug).to eq('goober-fish')
      @monster.update(hit_points: 12)
      expect(Monster.all.count).to eq(3)
      @monster.reload
      expect(@monster.slug).to eq('goober-fish')
    end
  end
end
