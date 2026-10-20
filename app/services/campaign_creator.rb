# frozen_string_literal: true

# Creates a campaign from a brief: the website's New Campaign guide, or the
# Foundry module's. Saves it, sets the party and builds the template's
# starting structure, all or nothing.
class CampaignCreator
  class UnknownTemplate < StandardError; end

  # The campaign attributes a DM can set, for both create and update. Use
  # .permit for a request's, so truths sent as strings are kept too.
  ATTRIBUTES = [
    :name, :premise, :pitch, :setting_name, :setting_notes, :mode, :status, :planned_sessions, :cadence,
    :party_size, :start_level, :target_level, :tone, { truths: %i[name description], excluded_compendium_packs: [] }
  ].freeze

  # A request's campaign attributes (ActionController::Parameters). Each truth
  # may be an object ({ name, description }) or, from older clients, a string;
  # the campaign normalizes both (see Campaign.normalize_truths).
  def self.permit(params)
    permitted = params.permit(*ATTRIBUTES)
    truths = params[:truths]
    permitted[:truths] = permitted_truths(truths) if truths.is_a?(Array)
    permitted
  end

  def self.permitted_truths(truths)
    truths.filter_map do |truth|
      case truth
      when String then truth
      when ActionController::Parameters then truth.permit(:name, :description).to_h
      end
    end
  end
  private_class_method :permitted_truths

  def initialize(user)
    @user = user
  end

  # `attributes` may leave out the mode; the template decides it. `party_ids`
  # are the DM's player characters (others are ignored). Raises UnknownTemplate
  # or ActiveRecord::RecordInvalid.
  def create!(attributes, template: nil, party_ids: nil)
    template = template.presence || 'blank'
    raise UnknownTemplate, template unless CampaignTemplate::TEMPLATES.include?(template)

    attributes = attributes.to_h.with_indifferent_access.reverse_merge(mode: CampaignTemplate::MODES[template])
    campaign = Campaign.new(attributes.merge(user: @user))
    Campaign.transaction do
      campaign.save!
      campaign.assign_party!(party_ids) if party_ids
      CampaignTemplate.apply!(campaign, template)
    end
    campaign
  end
end
