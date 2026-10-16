require 'rails_helper'

RSpec.describe CampaignSecret, type: :model do
  let(:campaign) { create(:campaign) }

  describe 'validations' do
    subject { build(:campaign_secret, campaign: campaign) }

    it { is_expected.to be_valid }
    it { is_expected.to validate_presence_of(:text) }
    it { is_expected.to validate_length_of(:text).is_at_most(1000) }
    it { is_expected.to validate_length_of(:revelation).is_at_most(120) }

    it 'rejects a revealed session from another campaign' do
      subject.assign_attributes(revealed: true, revealed_session: create(:campaign_session))

      expect(subject).not_to be_valid
      expect(subject.errors[:revealed_session]).to include('must belong to the same campaign')
    end

    it 'rejects a revealed session that does not exist' do
      subject.assign_attributes(revealed: true, revealed_session_id: 0)

      expect(subject).not_to be_valid
      expect(subject.errors[:revealed_session]).to include('must exist')
    end
  end

  describe '#revealed=' do
    let(:secret) { create(:campaign_secret, campaign: campaign) }
    let(:session) { create(:campaign_session, campaign: campaign) }

    it 'starts unrevealed' do
      expect(secret).not_to be_revealed
      expect(secret.revealed_at).to be_nil
    end

    it 'records when the secret was revealed' do
      freeze_time do
        secret.update!(revealed: true)

        expect(secret).to be_revealed
        expect(secret.revealed_at).to eq(Time.current)
      end
    end

    it 'keeps the original reveal time when revealed again' do
      secret.update!(revealed: true)
      original = secret.revealed_at

      travel 1.day do
        secret.update!(revealed: 'true')
      end

      expect(secret.reload.revealed_at).to eq(original)
    end

    it 'clears the reveal time and session when hidden again' do
      secret.update!(revealed: true, revealed_session: session)

      secret.update!(revealed: false)

      expect(secret.reload).to have_attributes(revealed_at: nil, revealed_session_id: nil)
      expect(secret).not_to be_revealed
    end

    it 'casts form values' do
      secret.revealed = '1'
      expect(secret).to be_revealed

      secret.revealed = '0'
      expect(secret).not_to be_revealed
    end

    it 'records the session it was revealed in' do
      secret.update!(revealed: true, revealed_session: session)

      expect(secret.reload.revealed_session).to eq(session)
      expect(session.revealed_secrets).to eq([secret])
    end

    it 'keeps the secret when the session it was revealed in is destroyed' do
      secret.update!(revealed: true, revealed_session: session)

      session.destroy!

      expect(secret.reload).to have_attributes(revealed_session_id: nil)
      expect(secret).to be_revealed
    end
  end

  describe '.unrevealed' do
    it 'returns secrets not yet revealed' do
      hidden = create(:campaign_secret, campaign: campaign)
      create(:campaign_secret, campaign: campaign, revealed: true)

      expect(campaign.secrets.unrevealed).to eq([hidden])
    end
  end

  describe '#as_json_for_api' do
    it 'serializes the secret' do
      session = create(:campaign_session, campaign: campaign)
      secret = create(:campaign_secret, campaign: campaign, text: 'The mayor is a doppelganger', revelation: 'Mayor',
                                        revealed: true, revealed_session: session, position: 2)

      expect(secret.as_json_for_api).to eq(
        id: secret.id.to_s, uuid: secret.uuid, text: 'The mayor is a doppelganger', revelation: 'Mayor', revealed: true,
        revealedAt: secret.revealed_at.iso8601, revealedSessionId: session.id.to_s, position: 2
      )
    end
  end

  describe 'revealed session consistency' do
    let(:campaign) { create(:campaign) }
    let(:session) { create(:campaign_session, campaign: campaign) }

    it 'drops the revealed session when the secret is not revealed' do
      secret = create(:campaign_secret, campaign: campaign, revealed_session: session)

      expect(secret.reload.revealed_session).to be_nil
    end

    it 'drops the revealed session when the secret is hidden again' do
      secret = create(:campaign_secret, campaign: campaign, revealed: true, revealed_session: session)

      secret.update!(revealed: false, revealed_session: session)

      expect(secret.reload.revealed_session).to be_nil
    end
  end

  describe 'session links' do
    it 'removes links to the secret when it is deleted' do
      campaign = create(:campaign)
      session = create(:campaign_session, campaign: campaign)
      secret = create(:campaign_secret, campaign: campaign)
      session.links.create!(linkable: secret)

      expect { secret.destroy! }.to change(CampaignSessionLink, :count).by(-1)
    end
  end
end
