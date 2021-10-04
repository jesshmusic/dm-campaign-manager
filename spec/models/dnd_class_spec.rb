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
  let!(:dungeon_master) { create :dungeon_master_user }

  context 'with the same name' do
    it 'should generate unique slugs' do
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

    it 'should maintain same slug on update with no name change' do
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

  context 'Ability Scores' do
    it 'should have ability scores' do
      @dnd_class = DndClass.find_by(slug: 'bard')
      scores = @dnd_class.ability_scores
      expect(scores.count).to eq(2)
      expect(scores.first.full_name).to eq('Charisma')
      expect(scores.find_by(name: 'DEX')).not_to be(nil)
    end
  end

  context 'Equipment' do
    it 'should have 2 starting equipment items' do
      @dnd_class = DndClass.find_by(slug: 'bard')
      equipments = @dnd_class.equipments
      expect(equipments.count).to eq(2)
      expect(equipments.first.name).to eq('Leather')
      expect(equipments.find_by(name: 'Leather')).not_to be(nil)
    end

    it 'should have 3 starting equipment options' do
      @dnd_class = DndClass.find_by(slug: 'bard')
      start_equipments = @dnd_class.starting_equipment_options
      expect(start_equipments.count).to eq(3)
      expect(start_equipments.first.equipment_type).to eq('equipment')
      expect(start_equipments.first.equipments.count).to eq(2)
      expect(start_equipments.first.equipment_options.count).to eq(1)
    end
  end

  context 'Multiclassing' do
    it 'should have multi-classing association' do
      DndClass.all.each do |dnd_class|
        expect(dnd_class.multi_classing).not_to be nil
      end
    end

    it 'should have prerequisites' do
      bard = DndClass.find_by(slug: 'bard')
      multi = bard.multi_classing
      expect(multi.multi_class_prereqs.count).to eq(1)
      expect(multi.multi_class_prereqs.first.ability_score).to eq('CHA')
      expect(multi.multi_class_prereqs.first.minimum_score).to eq(13)
    end

    it 'should have proficiencies' do
      bard = DndClass.find_by(slug: 'bard')
      multi = bard.multi_classing
      expect(multi.profs.count).to eq(1)
      expect(multi.profs.first.name).to eq('Light Armor')
      expect(multi.profs.first.prof_type).to eq('Armor')
    end

    it 'should have prof choices' do
      bard = DndClass.find_by(slug: 'bard')
      multi = bard.multi_classing
      expect(multi.prof_choices.count).to eq(2)
      expect(multi.prof_choices.first.name).to eq('Bard multiclassing 0')
      expect(multi.prof_choices.first.num_choices).to eq(1)
      expect(multi.prof_choices.first.profs.count).to eq(18)
    end
  end

  context 'Profs' do
    it 'should have 6 profs for Bard' do
      bard = DndClass.find_by(slug: 'bard')
      profs = bard.profs

      expect(profs.count).to be(6)
    end

    it 'should have 2 prof choices for Bard' do
      bard = DndClass.find_by(slug: 'bard')
      prof_choices = bard.prof_choices
      expect(prof_choices.count).to be(2)
    end

    it 'should have prof choices with lists of profs' do
      bard = DndClass.find_by(slug: 'bard')
      prof_choices = bard.prof_choices.first
      expect(prof_choices.profs.count).to eq(18)
      expect(prof_choices.num_choices).to eq(3)
    end
  end

  context 'Spellcasting' do
    it 'should have spellcasting association for Bard' do
      bard = DndClass.find_by(slug: 'bard')
      expect(bard.spell_casting).not_to be(nil)
      expect(bard.spell_casting.level).to be(1)
      expect(bard.spell_casting.spell_casting_infos.count).to eq(6)
      expect(bard.spell_casting.ability_score.name).to eq('CHA')
    end
  end

  context 'Subclasses' do
    it 'should have at least one subclass' do
      DndClass.all.each do |dnd_class|
        expect(dnd_class.subclasses.count).to be > 0
      end
    end
  end
end
