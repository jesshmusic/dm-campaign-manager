# == Schema Information
#
# Table name: dnd_classes
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  hit_die    :integer
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
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
  validates :name, :hit_die, presence: true
  validates_associated :prof_choices

  has_many :prof_choice_classes, dependent: :delete_all
  has_many :prof_choices, through: :prof_choice_classes

  has_many :prof_classes, dependent: :delete_all
  has_many :profs, through: :prof_classes

  has_many :spell_classes, dependent: :delete_all
  has_many :spells, through: :spell_classes

  belongs_to :user, optional: true
  
  accepts_nested_attributes_for :prof_choices

  include PgSearch::Model
  
  # PgSearch
  pg_search_scope :search_for,
                  against: { name: 'A' },
                  using: { tsearch: { prefix: true } }
                  
  def to_param
    slug
  end
end
