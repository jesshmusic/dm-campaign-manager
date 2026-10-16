require 'rails_helper'

RSpec.describe CampaignCreator do
  let(:user) { create(:dungeon_master_user) }
  let(:creator) { described_class.new(user) }

  it 'creates the campaign with the template, taking the mode from the template' do
    campaign = creator.create!({ name: 'Wild Coast' }, template: 'sandbox')

    expect(campaign).to be_persisted
    expect(campaign).to have_attributes(user: user, name: 'Wild Coast', mode: 'sandbox')
    expect(campaign.quests).not_to be_empty
  end

  it 'keeps a mode the request gives' do
    campaign = creator.create!({ 'name' => 'Odd one', 'mode' => 'oneshot' }, template: 'blank')

    expect(campaign.mode).to eq('oneshot')
  end

  it 'treats a missing template as blank' do
    campaign = creator.create!({ name: 'Nothing yet' })

    expect(campaign).to have_attributes(mode: 'arc')
    expect(campaign.sessions).to be_empty
  end

  it 'sets the party from the DM’s characters only' do
    akra = create(:player_character, user: user)
    not_mine = create(:player_character)

    campaign = creator.create!({ name: 'Party time' }, party_ids: [akra.id, not_mine.id])

    expect(campaign.party).to eq([akra])
  end

  it 'rejects an unknown template' do
    expect { creator.create!({ name: 'Nope' }, template: 'megadungeon') }
      .to raise_error(described_class::UnknownTemplate)
    expect(user.campaigns).to be_empty
  end

  it 'saves nothing when the campaign is not valid' do
    expect { creator.create!({ name: '' }, template: 'three_act') }.to raise_error(ActiveRecord::RecordInvalid)
    expect(user.campaigns).to be_empty
  end

  it 'has a mode for every template' do
    expect(CampaignTemplate::MODES.keys).to match_array(CampaignTemplate::TEMPLATES)
  end
end
