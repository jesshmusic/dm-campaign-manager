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
  validates :name, :level, :casting_time, :duration, :range, :school, presence: true
  after_validation(on: :create) do
    self.slug = generate_slug
  end

  has_many :spell_classes
  has_many :dnd_classes, through: :spell_classes

  belongs_to :user, optional: true

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
    self.slug = if user
                  Spell.exists?(name.parameterize) ? "#{name.parameterize}-#{user.username}-#{id}" : "#{name.parameterize}-#{user.username}"
                else
                  Spell.exists?(name.parameterize) ? "#{name.parameterize}-#{id}" : name.parameterize.to_s
                end
  end
end
