require 'rails_helper'
require Rails.root.join('db/migrate/20261019130000_create_setup_guide.rb')

# The migration inserts the guide's first words so it isn't empty when it goes live
RSpec.describe CreateSetupGuide do
  before do
    clear_setup_guide
    ActiveRecord::Migration.suppress_messages { described_class.new.seed_words }
  end

  it 'adds every step and template in order' do
    expect(SetupGuideStep.ordered.pluck(:key, :position)).to eq(SetupGuideStep::KEYS.each_with_index.to_a)
    expect(SetupGuideTemplate.ordered.pluck(:key, :position)).to eq(SetupGuideTemplate::KEYS.each_with_index.to_a)
  end

  it 'adds words the models accept' do
    expect(SetupGuideStep.all).to all(be_valid)
    expect(SetupGuideTemplate.all).to all(be_valid)
  end

  it 'keeps the example truths on their own lines' do
    expect(SetupGuideStep.find_by(key: 'world').example).to eq(
      "The dead do not rest easy in the Flanaess.\nThe Church of Pelor has closed its doors to the poor.\n" \
      "Hommlet’s walls were built for bandits, not armies."
    )
  end

  it 'words the books and review steps for the website and Foundry alike' do
    books = SetupGuideStep.find_by(key: 'books')
    expect(books.intro).to eq('Choose the compendiums this campaign uses for monsters, spells, items and tables.')
    expect(books.why).to start_with('On Dungeon Master Guru, monster and treasure searches use these')
    expect(books.why).to end_with('In a Foundry world, drag entries from these compendiums straight into your journals.')
    expect(SetupGuideStep.find_by(key: 'review').intro).to eq('Check your brief. You can change any of it later.')
  end
end
