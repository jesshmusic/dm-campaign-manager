# frozen_string_literal: true

# == Schema Information
#
# Table name: setup_guide_steps
#
#  id         :bigint           not null, primary key
#  example    :text
#  intro      :text             not null
#  key        :string           not null
#  label      :string           not null
#  position   :integer          not null
#  title      :string           not null
#  why        :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_setup_guide_steps_on_key  (key) UNIQUE
#
# One step of the new-campaign setup guide, as the website and the Foundry
# module show it. The steps are fixed (see KEYS); an admin edits their words.
class SetupGuideStep < ApplicationRecord
  KEYS = %w[kind pitch table world books review].freeze
  MAX_NAME_LENGTH = 60
  MAX_TEXT_LENGTH = 2000

  normalizes :label, :title, :intro, with: ->(value) { value.strip }
  normalizes :why, :example, with: ->(value) { value.strip.presence }

  validates :key, inclusion: { in: KEYS }, uniqueness: true
  validates :position, numericality: { only_integer: true }
  validates :label, :title, presence: true, length: { maximum: MAX_NAME_LENGTH }
  validates :intro, presence: true, length: { maximum: MAX_TEXT_LENGTH }
  validates :why, :example, length: { maximum: MAX_TEXT_LENGTH }

  scope :ordered, -> { order(:position, :id) }

  def as_json_for_api
    { id: key, label: label, title: title, intro: intro, why: why, example: example }
  end
end
