# frozen_string_literal: true

# == Schema Information
#
# Table name: spells
#
#  id            :bigint           not null, primary key
#  api_url       :string
#  casting_time  :string
#  components    :text             default([]), is an Array
#  concentration :boolean
#  description   :text
#  duration      :string
#  edition       :string           default("2014"), not null
#  higher_level  :text
#  level         :integer
#  material      :string
#  name          :string
#  page          :string
#  range         :string
#  ritual        :boolean
#  school        :string
#  slug          :string
#  spell_level   :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint
#
# Indexes
#
#  index_spells_on_edition           (edition)
#  index_spells_on_slug_and_edition  (slug,edition) UNIQUE
#  index_spells_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class Spell < ApplicationRecord
  include Editionable

  validates :name, :level, :casting_time, :duration, :range, :school, presence: true
  extend FriendlyId

  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  has_many :spell_classes
  has_many :dnd_classes, -> { distinct }, through: :spell_classes

  belongs_to :user, optional: true

  attr_accessor :current_user

  def get_spell_level_text
    if level <= 0
      'Cantrip'
    elsif level == 1
      '1st level'
    elsif level == 2
      '2nd level'
    elsif level == 3
      '3rd level'
    else
      "#{level}th level"
    end
  end

  def spell_classes
    if current_user
      dnd_classes.where(user_id: nil).or(dnd_classes.where(user_id: current_user.id)).map(&:name)
    else
      dnd_classes.where(user_id: nil).map(&:name)
    end
  end

  def description_text
    text_array = [
      '<div class="p-3">',
      "<h4>#{spell_level} #{school} <small><em>#{'(ritual)' if ritual}</em></small></h4>",
      "<p><strong>Range</strong> #{range}</p>",
      "<p><strong>Components</strong> #{components.map(&:to_s).join(', ')}</p>",
      "<p><strong>Material</strong> #{material}</p>",
      "<p><strong>Duration</strong> #{'Concentration, ' if concentration}#{duration}</p>",
      "<p><strong>Casting time</strong> #{casting_time}</p>",
      "<div>#{description}</div>"
    ]
    unless !higher_level || higher_level == ''
      text_array << '<h4 class="mt-3">Higher Level Effects</h4>'
      text_array << "<div>#{higher_level}</div>"
    end
    text_array << '</div>'
    text_array.join
  end

  include PgSearch::Model

  # PgSearch
  multisearchable against: %i[name description school]
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    description: 'B',
                    school: 'C'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end
