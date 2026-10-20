require 'rails_helper'
require Rails.root.join('db/migrate/20261020120000_convert_campaign_truths_to_named_entries.rb')

# Campaigns saved before truths had names keep them, split after the first sentence
RSpec.describe ConvertCampaignTruthsToNamedEntries do
  let(:campaign) { create(:campaign) }

  def migrate(direction)
    ActiveRecord::Migration.suppress_messages { described_class.new.public_send(direction) }
  end

  def store(truths)
    campaign.update_column(:truths, truths)
  end

  it 'splits each string truth after its first sentence' do
    store(['Greyhawk runs on gold. The Directing Oligarchy governs.', 'No punctuation here',
           'Who rules? Gold does. Always.', '  ', 'Trailing period.'])

    migrate(:up)

    expect(campaign.reload.truths).to eq([
                                           { 'name' => 'Greyhawk runs on gold.',
                                             'description' => 'The Directing Oligarchy governs.' },
                                           { 'name' => 'No punctuation here', 'description' => '' },
                                           { 'name' => 'Who rules?', 'description' => 'Gold does. Always.' },
                                           { 'name' => 'Trailing period.', 'description' => '' }
                                         ])
  end

  it 'splits the way the app does for strings older clients send' do
    texts = ['The dead walk! Nobody knows why.', "Wait... what?\nYes", 'e.g.no space']
    store(texts)

    migrate(:up)

    expect(campaign.reload.truths).to eq(Campaign.normalize_truths(texts))
  end

  it 'gives a converted campaign a new sync version, so Foundry pulls it again' do
    store(['The dead walk'])
    counter = campaign.reload.sync_counter

    migrate(:up)

    expect(campaign.reload).to have_attributes(sync_counter: counter + 1, sync_version: counter + 1)
  end

  it 'leaves campaigns with no truths, or already converted, alone' do
    converted = create(:campaign, truths: [{ name: 'Gold rules', description: 'All of it' }])
    empty = create(:campaign)
    versions = [converted, empty].map { |record| record.reload.sync_version }

    migrate(:up)

    expect([converted, empty].map { |record| record.reload.sync_version }).to eq(versions)
    expect(converted.truths).to eq([{ 'name' => 'Gold rules', 'description' => 'All of it' }])
    expect(empty.truths).to eq([])
  end

  it 'converts a mix of strings and objects, keeping the objects' do
    store(['First. One', { 'name' => 'Second', 'description' => 'Two' }])

    migrate(:up)

    expect(campaign.reload.truths).to eq([{ 'name' => 'First.', 'description' => 'One' },
                                          { 'name' => 'Second', 'description' => 'Two' }])
  end

  it 'joins names and descriptions back into strings when rolled back' do
    store([{ 'name' => 'Greyhawk runs on gold.', 'description' => 'The Directing Oligarchy governs.' },
           { 'name' => 'No punctuation here', 'description' => '' }])

    migrate(:down)

    expect(campaign.reload.truths).to eq(['Greyhawk runs on gold. The Directing Oligarchy governs.', 'No punctuation here'])
  end

  it 'round-trips strings with a sentence end' do
    store(['Greyhawk runs on gold. The Directing Oligarchy governs.', 'The dead walk'])

    migrate(:up)
    migrate(:down)

    expect(campaign.reload.truths).to eq(['Greyhawk runs on gold. The Directing Oligarchy governs.', 'The dead walk'])
  end
end
