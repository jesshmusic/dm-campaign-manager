# frozen_string_literal: true

# == Schema Information
#
# Table name: device_links
#
#  id                 :bigint           not null, primary key
#  approved_at        :datetime
#  consumed_at        :datetime
#  denied_at          :datetime
#  device_code_digest :string           not null
#  expires_at         :datetime         not null
#  last_polled_at     :datetime
#  user_code          :string           not null
#  world_title        :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  user_id            :bigint
#  world_id           :string
#
# Indexes
#
#  index_device_links_on_device_code_digest  (device_code_digest) UNIQUE
#  index_device_links_on_expires_at          (expires_at)
#  index_device_links_on_user_code           (user_code) UNIQUE WHERE (consumed_at IS NULL)
#  index_device_links_on_user_id             (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

# Links a Foundry module to a DM Guru account without pasting an API token
# (an OAuth-style device flow, as in RFC 8628):
#
# 1. The module calls .start! and shows the DM the short user code.
# 2. The signed-in DM enters the code on the website and approves (or denies) it.
# 3. The module polls with the long device code, and once the link is approved
#    #poll! issues an API token for the DM, exactly once.
#
# Only a SHA-256 digest of the device code is stored.
class DeviceLink < ApplicationRecord
  # No 0/O, 1/I/L, so a code read off a screen is typed correctly
  USER_CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'.chars.freeze
  USER_CODE_LENGTH = 8
  LIFETIME = 10.minutes
  # Seconds the module must wait between polls
  POLL_INTERVAL = 5
  # Polls up to this many seconds early still count, to allow for network jitter
  POLL_GRACE = 1
  WORLD_TITLE_MAX_LENGTH = 200
  WORLD_ID_MAX_LENGTH = 100
  START_ATTEMPTS = 5

  belongs_to :user, optional: true

  validates :device_code_digest, presence: true, uniqueness: true
  validates :user_code, presence: true, length: { is: USER_CODE_LENGTH }
  validates :expires_at, presence: true

  # Codes waiting for the DM to approve or deny them
  scope :pending, lambda {
    where(approved_at: nil, denied_at: nil, consumed_at: nil).where('expires_at > ?', Time.current)
  }

  # Only set on the instance returned by .start!
  attr_reader :device_code

  def self.start!(world_id: nil, world_title: nil)
    purge_expired
    attempts = 0
    begin
      attempts += 1
      device_code = SecureRandom.urlsafe_base64(32)
      # A savepoint, so a clash doesn't abort a surrounding transaction
      link = transaction(requires_new: true) do
        create!(
          device_code_digest: digest(device_code),
          user_code: generate_user_code,
          world_id: world_id.to_s.strip.first(WORLD_ID_MAX_LENGTH).presence,
          world_title: world_title.to_s.squish.first(WORLD_TITLE_MAX_LENGTH).presence,
          expires_at: LIFETIME.from_now
        )
      end
    rescue ActiveRecord::RecordNotUnique
      # A user code clashed with another pending one; try a fresh code
      retry if attempts < START_ATTEMPTS
      raise
    end
    link.instance_variable_set(:@device_code, device_code)
    link
  end

  def self.for_device_code(device_code)
    return if device_code.blank?

    find_by(device_code_digest: digest(device_code.to_s))
  end

  # Accepts the code with or without its dash, in any case
  def self.find_pending_by_user_code(code)
    normalized = normalize_user_code(code)
    return if normalized.length != USER_CODE_LENGTH

    pending.find_by(user_code: normalized)
  end

  def self.normalize_user_code(code)
    code.to_s.upcase.gsub(/[^A-Z0-9]/, '')
  end

  def self.generate_user_code
    Array.new(USER_CODE_LENGTH) { USER_CODE_ALPHABET[SecureRandom.random_number(USER_CODE_ALPHABET.length)] }.join
  end

  def self.digest(device_code)
    Digest::SHA256.hexdigest(device_code)
  end

  def self.purge_expired
    where(expires_at: ...Time.current).delete_all
  end

  def expired?
    expires_at <= Time.current
  end

  def approved?
    approved_at.present?
  end

  def denied?
    denied_at.present?
  end

  def consumed?
    consumed_at.present?
  end

  def pending?
    !approved? && !denied? && !consumed? && !expired?
  end

  # Shown to the DM as e.g. "WXYZ-2345"
  def display_user_code
    user_code.scan(/.{1,4}/).join('-')
  end

  # Both return false when the code was approved, denied or expired in the meantime
  def approve!(approving_user)
    with_lock { pending? && update!(user: approving_user, approved_at: Time.current) }
  end

  def deny!
    with_lock { pending? && update!(denied_at: Time.current) }
  end

  def api_token_name
    world_title.present? ? "Foundry: #{world_title}".first(100) : 'Foundry'
  end

  # Called each time the module polls. Returns one of
  #   [:pending], [:slow_down], [:expired], [:denied], or [:approved, api_token]
  # An approved link issues its API token once; later polls see :expired.
  def poll!
    with_lock do
      next [:expired] if consumed? || expired?
      next [:denied] if denied?
      next redeem! if approved?

      too_soon = last_polled_at.present? && last_polled_at > (POLL_INTERVAL - POLL_GRACE).seconds.ago
      update!(last_polled_at: Time.current)
      too_soon ? [:slow_down] : [:pending]
    end
  end

  def as_json_for_approval
    { userCode: display_user_code, worldTitle: world_title, expiresAt: expires_at.iso8601 }
  end

  private

  def redeem!
    token = ApiToken.issue!(user: user, name: api_token_name)
    update!(consumed_at: Time.current, last_polled_at: Time.current)
    [:approved, token]
  rescue ActiveRecord::RecordInvalid
    # e.g. the DM reached the API token limit after approving
    update!(denied_at: Time.current, consumed_at: Time.current, last_polled_at: Time.current)
    [:denied]
  end
end
