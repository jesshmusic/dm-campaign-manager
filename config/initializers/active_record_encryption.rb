# frozen_string_literal: true

# Keys for Active Record encryption (used for users' OpenAI API keys).
#
# Keys in credentials (`active_record_encryption.*`) win. Otherwise set
# ACTIVE_RECORD_ENCRYPTION_PRIMARY_KEY, ACTIVE_RECORD_ENCRYPTION_DETERMINISTIC_KEY
# and ACTIVE_RECORD_ENCRYPTION_KEY_DERIVATION_SALT (generate them with
# `bin/rails db:encryption:init`). Without either, keys are derived from
# secret_key_base, so no extra setup is needed; rotating secret_key_base then
# makes previously encrypted values unreadable.
encryption = Rails.application.config.active_record.encryption

%i[primary_key deterministic_key key_derivation_salt].each do |name|
  next if Rails.application.credentials.dig(:active_record_encryption, name).present?

  encryption[name] ||= ENV.fetch("ACTIVE_RECORD_ENCRYPTION_#{name.upcase}") do
    Rails.application.key_generator.generate_key("active_record_encryption/#{name}", 32).unpack1('H*')
  end
end
