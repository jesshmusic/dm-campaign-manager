# == Schema Information
#
# Table name: races
#
#  id                    :bigint           not null, primary key
#  charisma_modifier     :integer          default(0), not null
#  constitution_modifier :integer          default(0), not null
#  dexterity_modifier    :integer          default(0), not null
#  intelligence_modifier :integer          default(0), not null
#  name                  :string           default("New Race..."), not null
#  slug                  :string           not null
#  speed                 :string           default("30 feet"), not null
#  strength_modifier     :integer          default(0), not null
#  wisdom_modifier       :integer          default(0), not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  user_id               :bigint
#
# Indexes
#
#  index_races_on_name     (name)
#  index_races_on_slug     (slug)
#  index_races_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe Race, type: :model do
  context "with the same name" do
    before(:each) do
      dungeon_master = FactoryBot.create(:dungeon_master_user)
      @race = Race.create!(name: 'Goober Fish',)
      @race1 = Race.create!(name: 'Goober Fish',)
      @user_race = Race.create!(name: 'Goober Fish',
                                      user: dungeon_master,)
    end

    it "generates unique slugs" do
      expect(@race.slug).to eq('goober-fish')
      expect(@race1.slug).to eq('goober-fish-1')
      expect(@user_race.slug).to eq('goober-fish-jesshdm')
    end

    it "maintains same slug on update with no name change" do
      expect(@race.slug).to eq('goober-fish')
      @race.update(dexterity_modifier: 2)
      expect(Race.all.count).to eq(3)
      @race.reload
      expect(@race.slug).to eq('goober-fish')
      @race.update(dexterity_modifier: 1)
      expect(Race.all.count).to eq(3)
      @race.reload
      expect(@race.slug).to eq('goober-fish')
      @race.update(dexterity_modifier: 2)
      expect(Race.all.count).to eq(3)
      @race.reload
      expect(@race.slug).to eq('goober-fish')
    end
  end
end
