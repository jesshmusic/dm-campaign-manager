# frozen_string_literal: true

# Signed OAuth `state` for linking a Patreon account to a DM Guru user from the
# web app. Foundry module logins send a bare random id as the state instead,
# which never contains the prefix, so both flows can share one callback URL.
class PatreonLinkState
  PREFIX = 'web.'
  PURPOSE = :patreon_link
  TTL = 15.minutes

  def self.generate(user)
    PREFIX + verifier.generate(user.id, purpose: PURPOSE, expires_in: TTL)
  end

  def self.link_state?(state)
    state.to_s.start_with?(PREFIX)
  end

  # Returns the user the state was issued for, or nil when it is tampered with or expired
  def self.user_for(state)
    return unless link_state?(state)

    user_id = verifier.verified(state.delete_prefix(PREFIX), purpose: PURPOSE)
    user_id && User.find_by(id: user_id)
  end

  def self.verifier
    Rails.application.message_verifier(PURPOSE)
  end
end
