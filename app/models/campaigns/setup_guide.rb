# frozen_string_literal: true

# The words of the new-campaign setup guide: its steps and the kinds of
# campaign it offers. The website and the Foundry module both read them from
# GET /v1/setup_guide, and an admin edits them on the website.
#
# Which steps and templates there are, and their order, is fixed; only their
# words change.
class SetupGuide
  STEP_WORDS = %w[label title intro why example].freeze
  TEMPLATE_WORDS = %w[title description example].freeze

  attr_reader :errors

  def self.as_json_for_api
    steps = SetupGuideStep.ordered.to_a
    templates = SetupGuideTemplate.ordered.to_a
    {
      steps: steps.map(&:as_json_for_api),
      templates: templates.map(&:as_json_for_api),
      updatedAt: (steps + templates).map(&:updated_at).max
    }
  end

  def initialize
    @errors = []
  end

  # Changes the words of the given steps (`id` is the step's key) and templates
  # (`value` is the template's key), all or none. Returns true when saved;
  # otherwise #errors says what's wrong with each.
  def update(steps: [], templates: [])
    @errors = []
    records = assign(SetupGuideStep, steps, 'id', STEP_WORDS, 'step') +
              assign(SetupGuideTemplate, templates, 'value', TEMPLATE_WORDS, 'template')
    return false if errors.any?

    ActiveRecord::Base.transaction { records.uniq.each(&:save!) }
    true
  rescue ActiveRecord::RecordInvalid => e
    errors.concat(messages_for(e.record, e.record.is_a?(SetupGuideStep) ? 'step' : 'template'))
    false
  end

  private

  def assign(model, entries, key_name, words, kind)
    by_key = model.all.index_by(&:key)
    Array(entries).filter_map do |entry|
      key = entry[key_name].to_s
      record = by_key[key]
      unless record
        errors << "Unknown #{kind}: #{key.presence || '(none)'}"
        next
      end

      record.assign_attributes(entry.slice(*words))
      next record if record.valid?

      errors.concat(messages_for(record, kind))
      nil
    end
  end

  # e.g. "Pitch step: Title can't be blank"
  def messages_for(record, kind)
    messages = record.errors.full_messages.presence || ['Could not be saved']
    messages.map { |message| "#{record.key.humanize} #{kind}: #{message}" }
  end
end
