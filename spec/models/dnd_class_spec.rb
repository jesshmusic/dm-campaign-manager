# == Schema Information
#
# Table name: dnd_classes
#
#  id            :bigint           not null, primary key
#  api_url       :string
#  hit_die       :integer
#  name          :string
#  slug          :string
#  spell_ability :string
#  subclasses    :string           default([]), is an Array
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint
#
# Indexes
#
#  index_dnd_classes_on_slug     (slug) UNIQUE
#  index_dnd_classes_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

require 'rails_helper'

RSpec.describe DndClass, type: :model do
  context "with the same name" do
    let!(:dungeon_master) { create :dungeon_master_user }

    it "generates unique slugs" do
      @dnd_class = DndClass.create!(name: 'Fighter', hit_die: 10)
      @dnd_class1 = DndClass.create!(name: 'Fighter', hit_die: 10)
      @user_dnd_class = DndClass.create!(name: 'Fighter', hit_die: 20, user: dungeon_master)
      expect(@dnd_class.slug).to eq('fighter-1')
      expect(@dnd_class1.slug).to eq('fighter-2')
      expect(@user_dnd_class.slug).to eq('fighter-jesshdm1')
    end

    it 'should have 12 DndClasses' do
      expect(DndClass.all.count).to eq(12)
    end

    it "maintains same slug on update with no name change" do
      @dnd_class = DndClass.create!(name: 'Fighter', hit_die: 10)
      @dnd_class1 = DndClass.create!(name: 'Fighter', hit_die: 10)
      @user_dnd_class = DndClass.create!(name: 'Fighter', hit_die: 20, user: dungeon_master)
      expect(@dnd_class.slug).to eq('fighter-1')
      @dnd_class.update(hit_die: 12)
      expect(DndClass.all.count).to eq(15)
      @dnd_class.reload
      expect(@dnd_class.slug).to eq('fighter-1')
      @dnd_class.update(hit_die: 8)
      expect(DndClass.all.count).to eq(15)
      @dnd_class.reload
      expect(@dnd_class.slug).to eq('fighter-1')
      @dnd_class.update(hit_die: 12)
      expect(DndClass.all.count).to eq(15)
      @dnd_class.reload
      expect(@dnd_class.slug).to eq('fighter-1')
    end
  end
end
