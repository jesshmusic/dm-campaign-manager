require 'rails_helper'

RSpec.describe AuthorizationService, type: :service do
  let(:user) { create(:user) }
  let(:valid_token) { 'valid.jwt.token' }
  let(:invalid_token) { 'invalid.token' }
  let(:decoded_token) { [{ 'sub' => user.auth_id }] }

  describe '#initialize' do
    it 'stores the headers' do
      headers = { 'Authorization' => "Bearer #{valid_token}" }
      service = AuthorizationService.new(headers)
      expect(service.instance_variable_get(:@headers)).to eq(headers)
    end

    it 'accepts empty headers' do
      service = AuthorizationService.new({})
      expect(service.instance_variable_get(:@headers)).to eq({})
    end
  end

  describe '#authenticate_request!' do
    context 'with valid token' do
      let(:headers) { { 'Authorization' => "Bearer #{valid_token}" } }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:verify).with(valid_token).and_return(decoded_token)
      end

      it 'verifies the token successfully' do
        expect { service.authenticate_request! }.not_to raise_error
      end

      it 'calls JsonWebToken.verify with the token' do
        service.authenticate_request!
        expect(JsonWebToken).to have_received(:verify).with(valid_token)
      end
    end

    context 'with invalid token' do
      let(:headers) { { 'Authorization' => "Bearer #{invalid_token}" } }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:verify).with(invalid_token).and_raise(JWT::DecodeError)
      end

      it 'raises JWT::DecodeError' do
        expect { service.authenticate_request! }.to raise_error(JWT::DecodeError)
      end
    end

    context 'with missing Authorization header' do
      let(:headers) { {} }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:verify).with(nil).and_raise(JWT::DecodeError)
      end

      it 'raises JWT::DecodeError' do
        expect { service.authenticate_request! }.to raise_error(JWT::DecodeError)
      end
    end

    context 'with malformed Authorization header' do
      let(:headers) { { 'Authorization' => 'InvalidFormat' } }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:verify).with('InvalidFormat').and_raise(JWT::DecodeError)
      end

      it 'raises JWT::DecodeError' do
        expect { service.authenticate_request! }.to raise_error(JWT::DecodeError)
      end
    end

    context 'with expired token' do
      let(:headers) { { 'Authorization' => "Bearer #{valid_token}" } }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:verify).with(valid_token).and_raise(JWT::ExpiredSignature)
      end

      it 'raises JWT::ExpiredSignature' do
        expect { service.authenticate_request! }.to raise_error(JWT::ExpiredSignature)
      end
    end
  end

  describe '#get_current_user' do
    context 'with valid token and existing user' do
      let(:headers) { { 'Authorization' => "Bearer #{valid_token}" } }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:current_user_from_token)
          .with(valid_token)
          .and_return(decoded_token)
      end

      it 'returns the user' do
        result = service.get_current_user
        expect(result).to eq(user)
      end

      it 'finds user by auth_id' do
        expect(User).to receive(:find_by).with(auth_id: user.auth_id).and_return(user)
        service.get_current_user
      end
    end

    context 'with valid token but non-existent user' do
      let(:headers) { { 'Authorization' => "Bearer #{valid_token}" } }
      let(:service) { AuthorizationService.new(headers) }
      let(:non_existent_auth_id) { 'auth0|nonexistent123' }

      before do
        allow(JsonWebToken).to receive(:current_user_from_token)
          .with(valid_token)
          .and_return([{ 'sub' => non_existent_auth_id }])
      end

      it 'returns nil' do
        result = service.get_current_user
        expect(result).to be_nil
      end
    end

    context 'with missing Authorization header' do
      let(:headers) { {} }
      let(:service) { AuthorizationService.new(headers) }

      it 'returns nil' do
        result = service.get_current_user
        expect(result).to be_nil
      end
    end

    context 'with nil token response' do
      let(:headers) { { 'Authorization' => "Bearer #{valid_token}" } }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:current_user_from_token)
          .with(valid_token)
          .and_return(nil)
      end

      it 'returns nil' do
        result = service.get_current_user
        expect(result).to be_nil
      end
    end

    context 'with token missing sub claim' do
      let(:headers) { { 'Authorization' => "Bearer #{valid_token}" } }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:current_user_from_token)
          .with(valid_token)
          .and_return([{}])
      end

      it 'returns nil' do
        result = service.get_current_user
        expect(result).to be_nil
      end
    end

    context 'with empty sub claim' do
      let(:headers) { { 'Authorization' => "Bearer #{valid_token}" } }
      let(:service) { AuthorizationService.new(headers) }

      before do
        allow(JsonWebToken).to receive(:current_user_from_token)
          .with(valid_token)
          .and_return([{ 'sub' => nil }])
      end

      it 'returns nil' do
        result = service.get_current_user
        expect(result).to be_nil
      end
    end
  end

  describe 'private methods' do
    describe '#http_token' do
      it 'extracts token from Bearer authorization' do
        headers = { 'Authorization' => "Bearer #{valid_token}" }
        service = AuthorizationService.new(headers)
        token = service.send(:http_token)
        expect(token).to eq(valid_token)
      end

      it 'returns nil when Authorization header is missing' do
        headers = {}
        service = AuthorizationService.new(headers)
        token = service.send(:http_token)
        expect(token).to be_nil
      end

      it 'returns last part when Authorization header has multiple spaces' do
        headers = { 'Authorization' => "Bearer some.complex.token" }
        service = AuthorizationService.new(headers)
        token = service.send(:http_token)
        expect(token).to eq('some.complex.token')
      end
    end
  end
end
