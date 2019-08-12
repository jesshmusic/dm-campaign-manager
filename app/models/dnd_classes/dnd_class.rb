# frozen_string_literal: true

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

  has_many :prof_choices, inverse_of: :dnd_class

  has_many :prof_classes, dependent: :destroy
  has_many :profs, through: :prof_classes

  has_many :spell_classes, dependent: :destroy
  has_many :spells, through: :spell_classes

  belongs_to :user, optional: true

  accepts_nested_attributes_for :prof_choices, reject_if: :all_blank, allow_destroy: true

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: { name: 'A' },
                  using: { tsearch: { prefix: true } }

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug = if user
                  DndClass.exists?(name.parameterize) ? "#{name.parameterize}-#{user.username}-#{id}" : "#{name.parameterize}-#{user.username}"
                else
                  DndClass.exists?(name.parameterize) ? "#{name.parameterize}-#{id}" : name.parameterize.to_s
                end
  end
end
