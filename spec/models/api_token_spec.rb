# == Schema Information
#
# Table name: api_tokens
#
#  id           :bigint           not null, primary key
#  last_used_at :datetime
#  name         :string           not null
#  token_digest :string           not null
#  token_prefix :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_api_tokens_on_token_digest  (token_digest) UNIQUE
#  index_api_tokens_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
require 'rails_helper'

RSpec.describe ApiToken, type: :model do
  let(:user) { create(:dungeon_master_user) }

  describe '.issue!' do
    it 'returns a token with its plaintext and stores only a digest' do
      token = described_class.issue!(user: user, name: 'Foundry')

      expect(token.plaintext_token).to start_with(ApiToken::PREFIX)
      expect(token.token_digest).to eq(described_class.digest(token.plaintext_token))
      expect(token.token_digest).not_to include(token.plaintext_token)
      expect(token.token_prefix).to eq(token.plaintext_token.first(ApiToken::DISPLAY_PREFIX_LENGTH))
    end

    it 'does not expose the plaintext when the token is loaded later' do
      token = described_class.issue!(user: user, name: 'Foundry')

      expect(described_class.find(token.id).plaintext_token).to be_nil
    end

    it 'generates a different token each time' do
      first = described_class.issue!(user: user, name: 'One')
      second = described_class.issue!(user: user, name: 'Two')

      expect(first.plaintext_token).not_to eq(second.plaintext_token)
    end

    it 'requires a name' do
      expect { described_class.issue!(user: user, name: '') }.to raise_error(ActiveRecord::RecordInvalid)
    end

    it 'limits how many tokens a user can have' do
      ApiToken::MAX_PER_USER.times { |i| described_class.issue!(user: user, name: "Token #{i}") }

      expect { described_class.issue!(user: user, name: 'Extra') }.to raise_error(ActiveRecord::RecordInvalid, /at most/)
    end
  end

  describe '.authenticate' do
    let!(:token) { described_class.issue!(user: user, name: 'Foundry') }

    it 'finds the token for its plaintext' do
      expect(described_class.authenticate(token.plaintext_token)).to eq(token)
    end

    it 'returns nil for an unknown token' do
      expect(described_class.authenticate("#{ApiToken::PREFIX}nope")).to be_nil
    end

    it 'returns nil for blank or unprefixed input' do
      expect(described_class.authenticate(nil)).to be_nil
      expect(described_class.authenticate('')).to be_nil
      expect(described_class.authenticate(token.plaintext_token.delete_prefix(ApiToken::PREFIX))).to be_nil
    end

    it 'records when the token was last used' do
      freeze_time do
        described_class.authenticate(token.plaintext_token)
        expect(token.reload.last_used_at).to eq(Time.current)
      end
    end

    it 'only updates last_used_at once per minute' do
      token.update_column(:last_used_at, 30.seconds.ago)

      expect { described_class.authenticate(token.plaintext_token) }.not_to(change { token.reload.last_used_at })
    end
  end

  describe '#as_json_for_api' do
    it 'includes the plaintext only right after issuing' do
      token = described_class.issue!(user: user, name: 'Foundry')

      expect(token.as_json_for_api[:token]).to eq(token.plaintext_token)
      expect(described_class.find(token.id).as_json_for_api).not_to have_key(:token)
    end

    it 'never includes the digest' do
      token = described_class.issue!(user: user, name: 'Foundry')

      expect(token.as_json_for_api.values).not_to include(token.token_digest)
    end
  end
end
