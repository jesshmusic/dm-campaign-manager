# frozen_string_literal: true

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

# Personal access token that lets tools outside the web app (e.g. a Foundry
# module) act as a user. Only a SHA-256 digest is stored; the plaintext token
# is shown to the user once, when it is created.
class ApiToken < ApplicationRecord
  PREFIX = 'dmg_'
  MAX_PER_USER = 10
  DISPLAY_PREFIX_LENGTH = PREFIX.length + 4
  LAST_USED_RESOLUTION = 1.minute

  belongs_to :user

  validates :name, presence: true, length: { maximum: 100 }
  validates :token_digest, presence: true, uniqueness: true
  validates :token_prefix, presence: true
  validate :within_user_limit, on: :create

  # Only set on the instance returned by .issue!
  attr_reader :plaintext_token

  def self.issue!(user:, name:)
    plaintext = "#{PREFIX}#{SecureRandom.base58(40)}"
    token = new(user: user, name: name, token_digest: digest(plaintext), token_prefix: plaintext.first(DISPLAY_PREFIX_LENGTH))
    token.save!
    token.instance_variable_set(:@plaintext_token, plaintext)
    token
  end

  # Returns the matching token, or nil
  def self.authenticate(plaintext)
    return if plaintext.blank? || !plaintext.start_with?(PREFIX)

    token = find_by(token_digest: digest(plaintext))
    token&.touch_last_used
    token
  end

  def self.digest(plaintext)
    Digest::SHA256.hexdigest(plaintext)
  end

  def touch_last_used
    return if last_used_at.present? && last_used_at > LAST_USED_RESOLUTION.ago

    update!(last_used_at: Time.current)
  end

  def as_json_for_api
    {
      id: id.to_s,
      name: name,
      tokenPrefix: token_prefix,
      lastUsedAt: last_used_at&.iso8601,
      createdAt: created_at.iso8601
    }.tap { |json| json[:token] = plaintext_token if plaintext_token }
  end

  private

  def within_user_limit
    return unless user && user.api_tokens.count >= MAX_PER_USER

    errors.add(:base, "You can have at most #{MAX_PER_USER} API tokens")
  end
end
