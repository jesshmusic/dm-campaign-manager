# frozen_string_literal: true

# Configure Zeitwerk inflector to handle custom class naming conventions
Rails.autoloaders.each do |autoloader|
  autoloader.inflector.inflect(
    'openai' => 'OpenAI'
  )
end
