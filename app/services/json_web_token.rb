# frozen_string_literal: true
require 'net/http'
require 'uri'

class JsonWebToken
  def self.verify(token)
    JWT.decode(token,
               nil,
               true, # Verify the signature of this token
               algorithms: 'RS256',
               iss: 'https://dev-yfmjdt5a.us.auth0.com/',
               verify_iss: true,
               aud: 'dmScreenAPI',
               verify_aud: true) do |header, payload|
      jwks_hash[header['kid']]
    end
  end

  def self.current_user_from_token(token)
    JWT.decode(token,
               nil,
               false,
               algorithms: 'RS256',
               iss: 'https://dev-yfmjdt5a.us.auth0.com/',
               verify_iss: true,
               aud: 'dmScreenAPI',
               verify_aud: true) do |header|
      jwks_hash[header['kid']]
      header['sub']
    end
  end

  def self.jwks_hash
    jwks_raw = Net::HTTP.get URI('https://dev-yfmjdt5a.us.auth0.com/.well-known/jwks.json')
    jwks_keys = Array(JSON.parse(jwks_raw)['keys'])
    Hash[
      jwks_keys
        .map do |k|
        [
          k['kid'],
          OpenSSL::X509::Certificate.new(
            Base64.decode64(k['x5c'].first)
          ).public_key
        ]
      end
    ]
  end
end
