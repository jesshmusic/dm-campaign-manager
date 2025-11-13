# == Schema Information
#
# Table name: foundry_map_tags
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_foundry_map_tags_on_name  (name)
#  index_foundry_map_tags_on_slug  (slug) UNIQUE
#
class FoundryMapTag < ApplicationRecord
  # Associations
  has_many :foundry_map_taggings, dependent: :destroy
  has_many :foundry_maps, through: :foundry_map_taggings

  # Validations
  validates :name, presence: true, uniqueness: true
  validates :slug, presence: true, uniqueness: true

  # Callbacks
  before_validation :generate_slug

  # Scopes
  scope :ordered, -> { order(:name) }

  # Methods
  def as_json_for_api
    {
      value: slug,
      label: name,
      count: foundry_maps.published.count
    }
  end

  private

  def generate_slug
    self.slug = name.parameterize if name.present? && slug.blank?
  end
end
