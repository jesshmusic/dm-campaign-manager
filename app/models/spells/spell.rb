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
#  index_spells_on_slug     (slug) UNIQUE
#  index_spells_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class Spell < ApplicationRecord
  validates :name, :level, :casting_time, :duration, :range, :school, :slug, presence: true

  before_validation do
    self.slug = generate_slug if will_save_change_to_name?
  end

  has_many :spell_classes
  has_many :dnd_classes, -> { distinct }, through: :spell_classes

  belongs_to :user, optional: true

  attr_accessor :current_user

  include PgSearch::Model

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

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    school: 'B',
                    casting_time: 'C',
                    spell_level: 'D'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug = if user && !user.admin?
                  slug_from_string "#{name.parameterize}-#{user.username}"
                else
                  slug_from_string name.parameterize
                end
  end

  def slug_from_string(slug_string)
    class_num = 0
    new_slug = slug_string
    loop do
      new_slug = slug_string if class_num == 0
      new_slug = "#{slug_string}-#{class_num}" if class_num > 0
      break unless Spell.exists?(slug: new_slug)

      class_num += 1
    end
    new_slug
  end
end
