# == Schema Information
#
# Table name: dnd_classes
#
#  id                  :bigint           not null, primary key
#  api_url             :string
#  hit_die             :integer
#  name                :string
#  proficiencies       :string           default([]), is an Array
#  proficiency_choices :jsonb            is an Array
#  saving_throws       :string           default([]), is an Array
#  slug                :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint
#
# Indexes
#
#  index_dnd_classes_on_slug     (slug) UNIQUE
#  index_dnd_classes_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class DndClass < ApplicationRecord
  before_save :remove_blank_proficiencies
  before_save :remove_saving_throws
  before_save :remove_proficiency_choices

  has_many :spell_classes
  has_many :spells, through: :spell_classes

  belongs_to :user, optional: true

  include PgSearch
  
  # PgSearch
  pg_search_scope :search_for,
                  against: { name: 'A' },
                  using: { tsearch: { prefix: true } }
                  
  def to_param
    slug
  end

  def remove_blank_proficiencies
    proficiencies.reject!(&:blank?)
  end

  def remove_saving_throws
    proficiencies.reject!(&:blank?)
  end

  def remove_proficiency_choices
    proficiency_choices.reject!(&:blank?)
  end
end
