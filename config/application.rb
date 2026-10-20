require_relative "boot"

require "rails/all"
require "logger"

# Load environment variables from .env file before anything else
require "dotenv"
Dotenv.load

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module DungeonMasterScreenOnline
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 7.1

    config.autoload_paths += Dir[Rails.root.join('app', 'models', '**/')]
    # Lets a model's attribute set how its errors read in full (a "format" in
    # config/locales/en.yml), e.g. "Each truth needs a name" rather than "Truths ..."
    config.active_model.i18n_customize_full_message = true
    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
