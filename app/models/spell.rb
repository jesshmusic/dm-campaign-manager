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
#  duration      :text
#  higher_level  :text
#  level         :integer
#  material      :text
#  name          :text
#  page          :text
#  range         :text
#  ritual        :boolean
#  school        :text
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

  has_many :spell_classes
  has_many :dnd_classes, through: :spell_classes

  belongs_to :user, optional: true
  
  include PgSearch::Model
  
  def get_spell_level_text
    if level <= 0
      return 'Cantrip'
    elsif level == 1
      return '1st level'
    elsif level == 2
      return '2nd level'
    elsif level == 3
      return '3rd level'
    else
      return "#{level}th level"
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
end
