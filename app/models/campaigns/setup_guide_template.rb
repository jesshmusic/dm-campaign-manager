# frozen_string_literal: true

# == Schema Information
#
# Table name: setup_guide_templates
#
#  id          :bigint           not null, primary key
#  description :text             not null
#  example     :text             default(""), not null
#  key         :string           not null
#  position    :integer          not null
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_setup_guide_templates_on_key  (key) UNIQUE
#
# One kind of campaign the setup guide offers (see CampaignTemplate), with the
# words that describe it. The templates are fixed (see KEYS); an admin edits
# their words.
class SetupGuideTemplate < ApplicationRecord
  KEYS = %w[three_act sandbox five_room blank].freeze
  MAX_NAME_LENGTH = 60
  MAX_TEXT_LENGTH = 2000

  normalizes :title, :description, with: ->(value) { value.strip }
  # Optional, but always a string
  normalizes :example, with: ->(value) { value.to_s.strip }, apply_to_nil: true

  validates :key, inclusion: { in: KEYS }, uniqueness: true
  validates :position, numericality: { only_integer: true }
  validates :title, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :description, presence: true, length: { maximum: MAX_TEXT_LENGTH }
  validates :example, length: { maximum: MAX_TEXT_LENGTH }

  scope :ordered, -> { order(:position, :id) }

  def as_json_for_api
    { value: key, title: title, description: description, example: example }
  end
end
