# == Schema Information
#
# Table name: spells
#
#  id            :bigint           not null, primary key
#  api_url       :string
#  casting_time  :string
#  components    :text             default([]), is an Array
#  concentration :boolean
#  description   :text
#  duration      :string
#  higher_level  :text
#  level         :integer
#  material      :string
#  name          :string
#  page          :string
#  range         :string
#  ritual        :boolean
#  school        :string
#  slug          :string
#  spell_level   :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint
#
# Indexes
#
#  index_spells_on_slug     (slug) UNIQUE
#  index_spells_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe Spell, type: :model do
  context "with the same name" do
    before(:each) do
      dungeon_master = FactoryBot.create(:dungeon_master_user)
      @spell = Spell.create!(name: 'Chaos Missile From Hell',
                             level: 2,
                             casting_time: '1 Action',
                             duration: 'Instant',
                             range: '30 yards',
                             school: 'Evocation')
      @spell1 = Spell.create!(name: 'Chaos Missile From Hell',
                              level: 2,
                              casting_time: '1 Action',
                              duration: 'Instant',
                              range: '30 yards',
                              school: 'Evocation')
      @user_spell = Spell.create!(name: 'Chaos Missile From Hell',
                                  level: 2,
                                  casting_time: '1 Action',
                                  duration: 'Instant',
                                  range: '30 yards',
                                  school: 'Evocation',
                                  user: dungeon_master)
    end

    it "generates unique slugs" do
      expect(@spell.slug).to eq('chaos-missile-from-hell')
      expect(@spell1.slug).to eq('chaos-missile-from-hell-1')
      expect(@user_spell.slug).to eq('chaos-missile-from-hell-jesshdm')
    end

    it "maintains same slug on update with no name change" do
      expect(@spell.slug).to eq('chaos-missile-from-hell')
      @spell.update(level: 2)
      expect(Spell.all.count).to eq(3)
      @spell.reload
      expect(@spell.slug).to eq('chaos-missile-from-hell')
      @spell.update(level: 3)
      expect(Spell.all.count).to eq(3)
      @spell.reload
      expect(@spell.slug).to eq('chaos-missile-from-hell')
      @spell.update(level: 4)
      expect(Spell.all.count).to eq(3)
      @spell.reload
      expect(@spell.slug).to eq('chaos-missile-from-hell')
    end
  end
end
