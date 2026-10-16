# == Schema Information
#
# Table name: compendium_entries
#
#  id               :bigint           not null, primary key
#  category         :string           not null
#  challenge_rating :string
#  detail           :string
#  foundry_uuid     :string           not null
#  name             :string           not null
#  pack             :string           not null
#  pack_version     :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_compendium_entries_on_user_id_and_category_and_name  (user_id,category,name)
#  index_compendium_entries_on_user_id_and_foundry_uuid       (user_id,foundry_uuid) UNIQUE
#  index_compendium_entries_on_user_id_and_pack               (user_id,pack)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe CompendiumEntry, type: :model do
  let(:user) { create(:dungeon_master_user) }

  def entry(name, uuid: "Compendium.dnd-monster-manual.actors.Actor.mm#{name.delete(' ')}", **extra)
    { 'uuid' => uuid, 'name' => name, 'category' => 'monster', 'challengeRating' => '1/4', 'detail' => 'Undead' }
      .merge(extra.transform_keys(&:to_s))
  end

  describe 'factory' do
    it 'is valid' do
      expect(build(:compendium_entry)).to be_valid
    end
  end

  describe 'validations' do
    it { is_expected.to validate_inclusion_of(:pack).in_array(described_class::PACKS.keys) }
    it { is_expected.to validate_inclusion_of(:category).in_array(described_class::CATEGORIES) }

    it 'rejects a uuid that could break out of a Foundry link' do
      expect(build(:compendium_entry, foundry_uuid: 'Compendium.x]{evil}')).not_to be_valid
    end
  end

  describe '.replace_pack!' do
    it 'saves the entries with their pack and version' do
      count = described_class.replace_pack!(user, 'dnd-monster-manual.actors', 'mm@1', [entry('Zombie')])

      expect(count).to eq(1)
      expect(user.compendium_entries.sole).to have_attributes(
        name: 'Zombie', category: 'monster', challenge_rating: '1/4', detail: 'Undead', book: 'mm',
        pack: 'dnd-monster-manual.actors', pack_version: 'mm@1',
        foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie'
      )
    end

    it "replaces that pack's entries and leaves other packs alone" do
      create(:compendium_entry, user: user, name: 'Old Zombie')
      srd = create(:compendium_entry, user: user, pack: 'dnd5e.actors24', name: 'Ghoul')

      described_class.replace_pack!(user, 'dnd-monster-manual.actors', 'mm@2', [entry('Zombie')])

      expect(user.compendium_entries.pluck(:name)).to contain_exactly('Zombie', 'Ghoul')
      expect(srd.reload).to be_persisted
    end

    it "leaves other users' entries alone" do
      other = create(:compendium_entry, name: 'Not mine')

      described_class.replace_pack!(user, 'dnd-monster-manual.actors', 'mm@1', [])

      expect(other.reload).to be_persisted
    end

    it 'skips entries that are not valid' do
      entries = [
        entry('Zombie'),
        entry('Wrong pack', uuid: 'Compendium.dnd5e.actors24.Actor.mmGhoul00000000'),
        entry('Bad uuid', uuid: 'Compendium.dnd-monster-manual.actors.Actor.x]{y}'),
        entry(''),
        entry('Bad category', category: 'stat_block'),
        entry('Bad CR', challengeRating: '1/3'),
        entry('Long name' * 20),
        {}
      ]

      expect(described_class.replace_pack!(user, 'dnd-monster-manual.actors', 'mm@1', entries)).to eq(1)
      expect(user.compendium_entries.pluck(:name)).to eq(['Zombie'])
    end

    it 'keeps one entry per uuid and trims long details' do
      entries = [entry('Zombie', detail: 'x' * 100), entry('Zombie')]

      expect(described_class.replace_pack!(user, 'dnd-monster-manual.actors', 'mm@1', entries)).to eq(1)
      expect(user.compendium_entries.sole.detail.length).to eq(80)
    end

    it 'saves no challenge rating when there is none' do
      described_class.replace_pack!(user, 'dnd-monster-manual.actors', 'mm@1', [entry('Zombie', challengeRating: nil)])

      expect(user.compendium_entries.sole.challenge_rating).to be_nil
    end
  end

  describe '.search' do
    before do
      create(:compendium_entry, user: user, name: 'Ogre Zombie')
      create(:compendium_entry, user: user, name: 'Zombie')
      create(:compendium_entry, user: user, pack: 'dnd5e.actors24', name: 'Zombie')
      create(:compendium_entry, user: user, pack: 'dnd5e.actors24', name: 'Skeleton')
      create(:compendium_entry, user: user, pack: 'dnd5e.spells24', name: 'Zombie Wave', category: 'spell',
                                foundry_uuid: 'Compendium.dnd5e.spells24.Item.zombieWave000000')
    end

    it 'lists names starting with the query first' do
      expect(user.compendium_entries.search('zom').map(&:name)).to eq(['Zombie', 'Zombie Wave', 'Ogre Zombie'])
    end

    it 'shows the book entry instead of the SRD entry of the same name' do
      zombie = user.compendium_entries.search('zombie', categories: ['monster']).find { |e| e.name == 'Zombie' }

      expect(zombie.book).to eq('mm')
    end

    it 'filters by category' do
      expect(user.compendium_entries.search('zombie', categories: ['spell']).map(&:name)).to eq(['Zombie Wave'])
    end

    it 'lists everything for a blank query' do
      expect(user.compendium_entries.search('').size).to eq(4)
    end

    it 'treats LIKE wildcards in the query as text' do
      expect(user.compendium_entries.search('%')).to be_empty
    end
  end

  describe '.pack_summaries' do
    it 'counts entries per pack, books before the SRD' do
      create_list(:compendium_entry, 2, user: user)
      create(:compendium_entry, user: user, pack: 'dnd5e.actors24')

      mm = { pack: 'dnd-monster-manual.actors', book: 'mm', bookName: 'Monster Manual', label: 'Monsters', count: 2 }
      srd = { pack: 'dnd5e.actors24', book: 'srd', bookName: 'SRD 5.2', label: 'Monsters', count: 1 }
      expect(user.compendium_entries.pack_summaries).to eq([mm, srd])
    end
  end

  describe '#as_json_for_api' do
    it 'includes the book and the Foundry uuid' do
      zombie = create(:compendium_entry, name: 'Zombie', challenge_rating: '1/4',
                                         foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000')

      expect(zombie.as_json_for_api).to include(
        name: 'Zombie', category: 'monster', book: 'mm', bookName: 'Monster Manual', challengeRating: '1/4',
        detail: 'Undead', foundryUuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000'
      )
    end
  end
end
