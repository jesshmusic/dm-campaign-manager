# frozen_string_literal: true

# Concern for models that support multiple D&D editions (2014, 2024)
module Editionable
  extend ActiveSupport::Concern

  EDITIONS = %w[2014 2024].freeze
  # Default to 2014 to match existing data; frontend can request 2024 via header
  DEFAULT_EDITION = '2014'

  # Module-level methods accessible as Editionable.method_name
  class << self
    def valid_edition?(edition)
      EDITIONS.include?(edition.to_s)
    end

    def normalize_edition(edition)
      return DEFAULT_EDITION unless edition

      EDITIONS.include?(edition.to_s) ? edition.to_s : DEFAULT_EDITION
    end
  end

  included do
    validates :edition, inclusion: { in: EDITIONS }

    scope :for_edition, ->(edition) { where(edition: edition) }
    scope :edition_2014, -> { where(edition: '2014') }
    scope :edition_2024, -> { where(edition: '2024') }
  end

  # Class methods available on models that include this concern
  class_methods do
    def valid_edition?(edition)
      Editionable.valid_edition?(edition)
    end

    def normalize_edition(edition)
      Editionable.normalize_edition(edition)
    end
  end
end
