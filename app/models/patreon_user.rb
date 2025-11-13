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
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  patreon_id            :string
#  user_id               :string           not null
#
# Indexes
#
#  index_patreon_users_on_expires_at  (expires_at)
#  index_patreon_users_on_patreon_id  (patreon_id)
#  index_patreon_users_on_user_id     (user_id) UNIQUE
#
class PatreonUser < ApplicationRecord
  # Validations
  validates :user_id, presence: true, uniqueness: true

  # Scopes
  scope :active, -> { where('expires_at > ?', Time.current) }
  scope :premium, -> { where(has_premium: true) }

  # Methods
  def authenticated?
    expires_at.present? && expires_at > Time.current
  end

  def as_json_for_api
    {
      userId: user_id,
      has_free: has_free,
      has_premium: has_premium,
      expires_in: expires_at&.to_i
    }
  end

  def update_from_patreon!(patreon_data)
    update!(
      patreon_id: patreon_data[:patreon_id],
      email: patreon_data[:email],
      name: patreon_data[:name],
      has_free: patreon_data[:has_free],
      has_premium: patreon_data[:has_premium],
      expires_at: patreon_data[:expires_at],
      access_token: patreon_data[:access_token],
      refresh_token: patreon_data[:refresh_token],
      last_authenticated_at: Time.current
    )
  end
end
