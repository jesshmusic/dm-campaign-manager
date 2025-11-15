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

  context 'Ability Scores' do
    let!(:cha_score) { create(:cha_ability_score) }
    let!(:dex_score) { create(:dex_ability_score) }
    let!(:bard) do
      dnd_class = DndClass.create!(name: 'Bard', hit_die: 8, slug: 'bard-ability', spell_ability: 'CHA')
      dnd_class.ability_scores << cha_score
      dnd_class.ability_scores << dex_score
      dnd_class
    end

    it 'should have ability scores' do
      scores = bard.ability_scores
      expect(scores.count).to eq(2)
      expect(scores.find_by(name: 'CHA')).not_to be(nil)
      expect(scores.find_by(name: 'DEX')).not_to be(nil)
      expect(scores.map(&:full_name)).to include('Charisma', 'Dexterity')
    end
  end

  context 'Equipment' do
    let!(:bard) do
      dnd_class = DndClass.create!(name: 'Bard', hit_die: 8, slug: 'bard-equipment', spell_ability: 'CHA')
      dnd_class.equipments.create!(name: 'Leather', quantity: 1)
      dnd_class.equipments.create!(name: 'Dagger', quantity: 1)

      3.times do |i|
        option = dnd_class.starting_equipment_options.create!(
          equipment_type: 'equipment',
          choose: 1
        )
        option.equipments.create!(name: 'Leather', quantity: 1)
        option.equipments.create!(name: 'Dagger', quantity: 1)
        option.equipment_options.create!(equipment_type: 'choice', choose: 1)
      end
      dnd_class
    end

    it 'should have 2 starting equipment items' do
      equipments = bard.equipments
      expect(equipments.count).to eq(2)
      expect(equipments.first.name).to eq('Leather')
      expect(equipments.find_by(name: 'Leather')).not_to be(nil)
    end

    it 'should have 3 starting equipment options' do
      start_equipments = bard.starting_equipment_options
      expect(start_equipments.count).to eq(3)
      expect(start_equipments.first.equipment_type).to eq('equipment')
      expect(start_equipments.first.equipments.count).to eq(2)
      expect(start_equipments.first.equipment_options.count).to eq(1)
    end
  end

  context 'Multiclassing' do
    let!(:light_armor_prof) { Prof.find_or_create_by!(name: 'Light Armor', prof_type: 'Armor') }
    let!(:skill_profs) do
      profs = []
      18.times do |i|
        profs << Prof.find_or_create_by!(name: "Skill: Test Skill #{i}", prof_type: 'Skills')
      end
      profs
    end
    let!(:bard) do
      dnd_class = DndClass.create!(name: 'Bard', hit_die: 8, slug: 'bard-multi', spell_ability: 'CHA')
      multi = dnd_class.create_multi_classing!
      multi.multi_class_prereqs.create!(ability_score: 'CHA', minimum_score: 13)
      multi.profs << light_armor_prof
      2.times do |i|
        choice = multi.prof_choices.create!(
          name: "Bard multiclassing #{i}",
          num_choices: 1,
          prof_choice_type: 'Skills'
        )
        choice.profs << skill_profs
      end
      dnd_class
    end

    it 'should have multi-classing association' do
      expect(bard.multi_classing).not_to be nil
    end

    it 'should have prerequisites' do
      multi = bard.multi_classing
      expect(multi.multi_class_prereqs.count).to eq(1)
      expect(multi.multi_class_prereqs.first.ability_score).to eq('CHA')
      expect(multi.multi_class_prereqs.first.minimum_score).to eq(13)
    end

    it 'should have proficiencies' do
      multi = bard.multi_classing
      expect(multi.profs.count).to eq(1)
      expect(multi.profs.first.name).to eq('Light Armor')
      expect(multi.profs.first.prof_type).to eq('Armor')
    end

    it 'should have prof choices' do
      multi = bard.multi_classing
      expect(multi.prof_choices.count).to eq(2)
      expect(multi.prof_choices.first.name).to eq('Bard multiclassing 0')
      expect(multi.prof_choices.first.num_choices).to eq(1)
      expect(multi.prof_choices.first.prof_choice_type).to eq('Skills')
      expect(multi.prof_choices.first.profs.count).to eq(18)
    end
  end

  context 'Profs' do
    let!(:bard_profs) do
      profs = []
      6.times do |i|
        profs << Prof.find_or_create_by!(name: "Bard Prof #{i}", prof_type: 'Skills')
      end
      profs
    end
    let!(:skill_profs) do
      profs = []
      18.times do |i|
        profs << Prof.find_or_create_by!(name: "Skill: Test Skill #{i}", prof_type: 'Skills')
      end
      profs
    end
    let!(:bard) do
      dnd_class = DndClass.create!(name: 'Bard', hit_die: 8, slug: 'bard-profs', spell_ability: 'CHA')
      dnd_class.profs << bard_profs
      2.times do |i|
        choice = dnd_class.prof_choices.create!(
          name: "Bard prof choice #{i}",
          num_choices: i == 0 ? 3 : 1,
          prof_choice_type: 'Skills'
        )
        choice.profs << skill_profs
      end
      dnd_class
    end

    it 'should have 6 profs for Bard' do
      profs = bard.profs
      expect(profs.count).to be(6)
    end

    it 'should have 2 prof choices for Bard' do
      prof_choices = bard.prof_choices
      expect(prof_choices.count).to be(2)
    end

    it 'should have prof choices with lists of profs' do
      prof_choices = bard.prof_choices.first
      expect(prof_choices.profs.count).to eq(18)
      expect(prof_choices.num_choices).to eq(3)
    end
  end

  context 'Spellcasting' do
    let!(:cha_score) { create(:cha_ability_score) }
    let!(:bard) do
      dnd_class = DndClass.create!(name: 'Bard', hit_die: 8, slug: 'bard-spell', spell_ability: 'CHA')
      spell_cast = dnd_class.create_spell_casting!(level: 1, ability_score: cha_score)
      6.times do |i|
        spell_cast.spell_casting_infos.create!(name: "Level #{i}")
      end
      dnd_class
    end

    it 'should have spellcasting association for Bard' do
      expect(bard.spell_casting).not_to be(nil)
      expect(bard.spell_casting.level).to be(1)
      expect(bard.spell_casting.spell_casting_infos.count).to eq(6)
      expect(bard.spell_casting.ability_score.name).to eq('CHA')
    end
  end

  context 'Subclasses' do
    let!(:bard) do
      dnd_class = DndClass.create!(name: 'Bard', hit_die: 8, slug: 'bard-subclass', spell_ability: 'CHA')
      dnd_class.subclasses << 'College of Lore'
      dnd_class
    end

    it 'should have at least one subclass' do
      expect(bard.subclasses.count).to be > 0
    end
  end
end
