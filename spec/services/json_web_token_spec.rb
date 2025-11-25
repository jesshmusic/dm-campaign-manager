require 'rails_helper'

RSpec.describe JsonWebToken do
  let(:valid_token) { 'valid.jwt.token' }
  let(:invalid_token) { 'invalid.jwt.token' }
  let(:kid) { 'test-key-id' }
  let(:public_key) { OpenSSL::PKey::RSA.new(2048).public_key }

  let(:test_certificate) do
    rsa_key = OpenSSL::PKey::RSA.new(2048)
    cert = OpenSSL::X509::Certificate.new
    cert.version = 2
    cert.serial = 1
    cert.subject = OpenSSL::X509::Name.parse('/CN=Test')
    cert.issuer = cert.subject
    cert.public_key = rsa_key.public_key
    cert.not_before = Time.now
    cert.not_after = Time.now + 3600
    cert.sign(rsa_key, OpenSSL::Digest.new('SHA256'))
    cert
  end

  let(:jwks_response) do
    {
      'keys' => [
        {
          'kid' => kid,
          'x5c' => [Base64.strict_encode64(test_certificate.to_der)]
        }
      ]
    }.to_json
  end

  let(:decoded_token) do
    [
      { 'sub' => 'auth0|123456', 'aud' => 'dmScreenAPI' },
      { 'kid' => kid, 'alg' => 'RS256' }
    ]
  end

  before do
    allow(Net::HTTP).to receive(:get).and_return(jwks_response)
    allow(OpenSSL::X509::Certificate).to receive(:new).and_return(
      double(public_key: public_key)
    )
  end

  describe '.verify' do
    context 'with a valid token' do
      it 'successfully decodes and verifies the token' do
        allow(JWT).to receive(:decode).and_return(decoded_token)

        result = described_class.verify(valid_token)

        expect(result).to eq(decoded_token)
        expect(JWT).to have_received(:decode).with(
          valid_token,
          nil,
          true,
          hash_including(
            algorithms: 'RS256',
            iss: 'https://dev-yfmjdt5a.us.auth0.com/',
            verify_iss: true,
            aud: 'dmScreenAPI',
            verify_aud: true
          )
        )
      end

      it 'fetches and uses JWKS for verification' do
        allow(JWT).to receive(:decode).and_yield({ 'kid' => kid }, {}).and_return(decoded_token)

        described_class.verify(valid_token)

        expect(Net::HTTP).to have_received(:get).with(
          URI('https://dev-yfmjdt5a.us.auth0.com/.well-known/jwks.json')
        )
      end
    end

    context 'with an invalid token' do
      it 'raises JWT::DecodeError for malformed tokens' do
        allow(JWT).to receive(:decode).and_raise(JWT::DecodeError, 'Invalid token')

        expect {
          described_class.verify(invalid_token)
        }.to raise_error(JWT::DecodeError, 'Invalid token')
      end

      it 'raises JWT::VerificationError for signature mismatch' do
        allow(JWT).to receive(:decode).and_raise(JWT::VerificationError, 'Signature verification failed')

        expect {
          described_class.verify(invalid_token)
        }.to raise_error(JWT::VerificationError)
      end

      it 'raises JWT::ExpiredSignature for expired tokens' do
        allow(JWT).to receive(:decode).and_raise(JWT::ExpiredSignature, 'Token has expired')

        expect {
          described_class.verify(invalid_token)
        }.to raise_error(JWT::ExpiredSignature)
      end
    end

  end

  describe '.current_user_from_token' do
    context 'with a valid token' do
      it 'extracts user subject from token without verification' do
        allow(JWT).to receive(:decode).and_yield({ 'sub' => 'auth0|123456' }).and_return(decoded_token)

        result = described_class.current_user_from_token(valid_token)

        expect(result).to eq(decoded_token)
        expect(JWT).to have_received(:decode).with(
          valid_token,
          nil,
          false, # Does not verify signature
          hash_including(algorithms: 'RS256')
        )
      end

      it 'returns the decoded payload and header' do
        allow(JWT).to receive(:decode).and_return(decoded_token)

        result = described_class.current_user_from_token(valid_token)

        expect(result[0]).to include('sub' => 'auth0|123456')
        expect(result[1]).to include('kid' => kid)
      end
    end

    context 'with an invalid token' do
      it 'raises JWT::DecodeError for malformed tokens' do
        allow(JWT).to receive(:decode).and_raise(JWT::DecodeError, 'Not enough or too many segments')

        expect {
          described_class.current_user_from_token(invalid_token)
        }.to raise_error(JWT::DecodeError)
      end
    end
  end

  describe '.jwks_hash' do
    it 'fetches JWKS from Auth0' do
      described_class.jwks_hash

      expect(Net::HTTP).to have_received(:get).with(
        URI('https://dev-yfmjdt5a.us.auth0.com/.well-known/jwks.json')
      )
    end

    it 'parses JWKS and creates a hash of kid => public_key' do
      result = described_class.jwks_hash

      expect(result).to be_a(Hash)
      expect(result[kid]).to eq(public_key)
    end

    it 'decodes base64 encoded certificates' do
      described_class.jwks_hash

      expect(OpenSSL::X509::Certificate).to have_received(:new)
    end

    context 'when JWKS fetch fails' do
      it 'raises SocketError for network failures' do
        allow(Net::HTTP).to receive(:get).and_raise(SocketError, 'getaddrinfo: Name or service not known')

        expect {
          described_class.jwks_hash
        }.to raise_error(SocketError)
      end

      it 'raises JSON::ParserError for invalid JSON response' do
        allow(Net::HTTP).to receive(:get).and_return('<html>Error</html>')

        expect {
          described_class.jwks_hash
        }.to raise_error(JSON::ParserError)
      end

      it 'raises OpenSSL::X509::CertificateError for invalid certificates' do
        allow(OpenSSL::X509::Certificate).to receive(:new).and_raise(
          OpenSSL::X509::CertificateError, 'Invalid certificate'
        )

        expect {
          described_class.jwks_hash
        }.to raise_error(OpenSSL::X509::CertificateError)
      end
    end
  end
end
