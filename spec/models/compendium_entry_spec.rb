# == Schema Information
#
# Table name: compendium_entries
#
#  id               :bigint           not null, primary key
#  category         :string           not null
#  challenge_rating :string
#  detail           :string
#  foundry_uuid     :string           not null
#  homebrew         :boolean          default(FALSE), not null
#  name             :string           not null
#  pack             :string           not null
#  pack_label       :string
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

    it 'takes any well-formed pack id and a label for homebrew' do
      expect(build(:compendium_entry, :homebrew)).to be_valid
      expect(build(:compendium_entry, :homebrew, pack: 'world-actors.greyhawk', foundry_uuid: 'Actor.abcdefghijklmnop')).to be_valid
      expect(build(:compendium_entry, :homebrew, pack: 'not a pack')).not_to be_valid
      expect(build(:compendium_entry, :homebrew, pack_label: nil)).not_to be_valid
      expect(build(:compendium_entry, :homebrew, pack_label: 'x' * 121)).not_to be_valid
    end
  end

  describe '.pack_id?' do
    it 'is a core book pack, or a homebrew one ("<package>.<pack>")' do
      expect(described_class.pack_id?('dnd5e.actors24')).to be(true)
      expect(described_class.pack_id?('world-actors.greyhawk-2')).to be(true)
      expect(described_class.pack_id?('some-module.my_monsters')).to be(true)
      ['world', 'world.my.monsters', 'world.my monsters', "world.#{'x' * 100}", nil, 5].each do |pack|
        expect(described_class.pack_id?(pack)).to be(false), "expected #{pack.inspect} not to be a pack id"
      end
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

    it 'leaves a core pack unlabelled' do
      described_class.replace_pack!(user, 'dnd-monster-manual.actors', 'mm@1', [entry('Zombie')], label: 'Mine now')

      expect(user.compendium_entries.sole).to have_attributes(homebrew: false, pack_label: nil, book: 'mm')
    end

    describe 'homebrew' do
      it "saves a homebrew compendium's entries with its label" do
        entries = [entry('Owlbear King', uuid: 'Compendium.world.my-monsters.Actor.abcdefghijklmnop'),
                   entry('Elsewhere', uuid: 'Compendium.world.other.Actor.abcdefghijklmnop')]

        expect(described_class.replace_pack!(user, 'world.my-monsters', 'v1', entries, label: 'My Monsters')).to eq(1)
        expect(user.compendium_entries.sole).to have_attributes(
          name: 'Owlbear King', pack: 'world.my-monsters', pack_label: 'My Monsters', homebrew: true, book: 'other',
          book_name: 'Homebrew: My Monsters'
        )
      end

      it "saves a world's actors, which are world actor uuids" do
        entries = [entry('Captain Brandt', uuid: 'Actor.abcdefghijklmnop'),
                   entry('Not an actor', uuid: 'Item.abcdefghijklmnop'),
                   entry('In a compendium', uuid: 'Compendium.world-actors.greyhawk.Actor.abcdefghijklmnop'),
                   entry('Short', uuid: 'Actor.short')]

        count = described_class.replace_pack!(user, 'world-actors.greyhawk', nil, entries, label: 'World actors (Greyhawk)')

        expect(count).to eq(1)
        expect(user.compendium_entries.sole).to have_attributes(name: 'Captain Brandt', foundry_uuid: 'Actor.abcdefghijklmnop',
                                                                homebrew: true, pack_label: 'World actors (Greyhawk)')
      end

      it "keeps each world's actors apart" do
        described_class.replace_pack!(user, 'world-actors.greyhawk', nil, [entry('Brandt', uuid: 'Actor.abcdefghijklmnop')],
                                      label: 'World actors (Greyhawk)')
        described_class.replace_pack!(user, 'world-actors.oerth', nil, [entry('Vex', uuid: 'Actor.qrstuvwxyzabcdef')],
                                      label: 'World actors (Oerth)')

        expect(user.compendium_entries.pluck(:pack, :name)).to contain_exactly(['world-actors.greyhawk', 'Brandt'],
                                                                               ['world-actors.oerth', 'Vex'])
      end

      it "doesn't take world actor uuids in a compendium, or the old world.actors pack's" do
        actor = [entry('Brandt', uuid: 'Actor.abcdefghijklmnop')]

        expect(described_class.replace_pack!(user, 'world.my-monsters', nil, actor, label: 'Mine')).to eq(0)
        expect(described_class.replace_pack!(user, 'world.actors', nil, actor, label: 'Actors')).to eq(0)
        expect(described_class.replace_pack!(user, 'world-actors.Grey_Hawk', nil, actor, label: 'Actors')).to eq(0)
      end

      it 'removes a homebrew pack sent with no entries' do
        create(:compendium_entry, :homebrew, user: user)

        described_class.replace_pack!(user, 'world.my-monsters', nil, [])

        expect(user.compendium_entries).to be_empty
      end
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

    it 'never hides homebrew behind a book entry of the same name' do
      create(:compendium_entry, :homebrew, user: user, name: 'Zombie')
      create(:compendium_entry, :homebrew, user: user, name: 'Zombie', pack: 'world-actors.greyhawk',
                                           foundry_uuid: 'Actor.abcdefghijklmnop')

      zombies = user.compendium_entries.search('zombie', categories: ['monster']).select { |e| e.name == 'Zombie' }

      expect(zombies.map(&:book)).to eq(%w[mm other other])
    end

    it 'treats wildcards and regular expression characters in the query as text' do
      expect(user.compendium_entries.search('%')).to be_empty
      expect(user.compendium_entries.search('.*')).to be_empty
      expect(user.compendium_entries.search('(')).to be_empty
    end

    it 'matches the start of a word, not the middle of one' do
      create(:compendium_entry, user: user, name: 'Cult Fanatic')
      create(:compendium_entry, user: user, name: 'Knight')

      expect(user.compendium_entries.search('fanatic').map(&:name)).to eq(['Cult Fanatic'])
      expect(user.compendium_entries.search('nigh')).to be_empty
      expect(user.compendium_entries.search('ogre zom').map(&:name)).to eq(['Ogre Zombie'])
    end
  end

  describe '.pack_summaries' do
    it 'counts entries per pack, books before the SRD' do
      create_list(:compendium_entry, 2, user: user)
      create(:compendium_entry, user: user, pack: 'dnd5e.actors24')

      mm = { pack: 'dnd-monster-manual.actors', book: 'mm', bookName: 'Monster Manual', label: 'Monsters', count: 2,
             homebrew: false }
      srd = { pack: 'dnd5e.actors24', book: 'srd', bookName: 'SRD 5.2', label: 'Monsters', count: 1, homebrew: false }
      expect(user.compendium_entries.pack_summaries).to eq([mm, srd])
    end

    it 'lists homebrew packs after the books, by label' do
      create(:compendium_entry, user: user)
      create_list(:compendium_entry, 2, :homebrew, user: user)
      create(:compendium_entry, :homebrew, user: user, pack: 'world-actors.greyhawk', pack_label: 'Actors in Greyhawk',
                                           foundry_uuid: 'Actor.abcdefghijklmnop')

      expect(user.compendium_entries.pack_summaries.map { |summary| summary.values_at(:pack, :bookName, :label, :count) })
        .to eq([['dnd-monster-manual.actors', 'Monster Manual', 'Monsters', 1],
                ['world-actors.greyhawk', 'Homebrew', 'Actors in Greyhawk', 1],
                ['world.my-monsters', 'Homebrew', 'My Monsters', 2]])
      expect(user.compendium_entries.pack_summaries.last).to include(book: 'other', homebrew: true)
    end
  end

  describe '#as_json_for_api' do
    it 'includes the book and the Foundry uuid' do
      zombie = create(:compendium_entry, name: 'Zombie', challenge_rating: '1/4',
                                         foundry_uuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000')

      expect(zombie.as_json_for_api).to include(
        name: 'Zombie', category: 'monster', book: 'mm', bookName: 'Monster Manual', challengeRating: '1/4',
        detail: 'Undead', foundryUuid: 'Compendium.dnd-monster-manual.actors.Actor.mmZombie00000000', homebrew: false
      )
    end

    it "labels homebrew with its pack's title" do
      entry = create(:compendium_entry, :homebrew, name: 'Owlbear King')

      expect(entry.as_json_for_api).to include(name: 'Owlbear King', book: 'other', bookName: 'Homebrew: My Monsters',
                                               homebrew: true)
    end
  end
end
