# == Schema Information
#
# Table name: patreon_users
#
#  id                    :bigint           not null, primary key
#  access_token          :string
#  email                 :string
#  expires_at            :datetime
#  has_free              :boolean          default(TRUE)
#  has_premium           :boolean          default(FALSE)
#  last_authenticated_at :datetime
#  name                  :string
#  refresh_token         :string
#  tier_name             :string
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  linked_user_id        :bigint
#  patreon_id            :string
#  user_id               :string
#
# Indexes
#
#  index_patreon_users_on_expires_at      (expires_at)
#  index_patreon_users_on_linked_user_id  (linked_user_id) UNIQUE
#  index_patreon_users_on_patreon_id      (patreon_id)
#  index_patreon_users_on_user_id         (user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (linked_user_id => users.id)
#

# A row comes from one of two Patreon logins:
# - the Foundry module, keyed by the module-generated `user_id`
# - the web app, linked to a DM Guru account through `linked_user`
class PatreonUser < ApplicationRecord
  belongs_to :linked_user, class_name: 'User', optional: true, inverse_of: :patreon_account

  # Validations
  validates :user_id, uniqueness: true, allow_nil: true
  validates :linked_user_id, uniqueness: true, allow_nil: true
  validate :foundry_user_or_linked_user

  # The daily membership refresh renews tokens expiring within REFRESH_AHEAD
  # and gives up on ones that lapsed more than REFRESH_LAPSED ago
  REFRESH_AHEAD = 7.days
  REFRESH_LAPSED = 30.days

  # Scopes
  scope :active, -> { where('expires_at > ?', Time.current) }
  scope :premium, -> { where(has_premium: true) }
  scope :due_for_refresh, lambda {
    where.not(refresh_token: [nil, '']).where(expires_at: REFRESH_LAPSED.ago..REFRESH_AHEAD.from_now)
  }

  # Methods
  def authenticated?
    expires_at.present? && expires_at > Time.current
  end

  def premium_active?
    authenticated? && has_premium
  end

  # Link status shown in the web app's user dashboard
  def as_json_for_account
    {
      name: name,
      tierName: mapped_tier_name,
      hasPremium: has_premium,
      active: authenticated?,
      expiresAt: expires_at&.iso8601
    }
  end

  # Map legacy tier names to current tiers
  def mapped_tier_name
    tier = tier_name || 'Free'
    tier == 'Adventurer' ? 'Wizard' : tier
  end

  def as_json_for_api
    {
      userId: user_id,
      has_free: has_free,
      has_premium: has_premium,
      tier_name: mapped_tier_name,
      expires_in: expires_at ? (expires_at.to_f * 1000).to_i : nil # Convert to milliseconds for JavaScript
    }
  end

  def update_from_patreon!(patreon_data)
    update!(
      patreon_id: patreon_data[:patreon_id],
      email: patreon_data[:email],
      name: patreon_data[:name],
      has_free: patreon_data[:has_free],
      has_premium: patreon_data[:has_premium],
      tier_name: patreon_data[:tier_name],
      expires_at: patreon_data[:expires_at],
      access_token: patreon_data[:access_token],
      refresh_token: patreon_data[:refresh_token],
      last_authenticated_at: Time.current
    )
  end

  private

  def foundry_user_or_linked_user
    return if user_id.present? || linked_user_id.present?

    errors.add(:base, 'Patreon login must belong to a Foundry user or a DM Guru account')
  end
end
