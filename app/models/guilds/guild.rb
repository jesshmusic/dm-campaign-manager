# frozen_string_literal: true

# == Schema Information
#
# Table name: guilds
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_guilds_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#


class Guild < ApplicationRecord
  validates :name, :description, presence: true

  before_validation do
    self.slug = generate_slug if will_save_change_to_name?
  end

  belongs_to :campaign
  has_many :characters, dependent: :destroy

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {name: 'A', description: 'B'},
                  using: {tsearch: {prefix: true}}

  def to_param
    slug
  end

  def pcs
    characters.where(type: 'PlayerCharacter')
  end

  def npcs
    characters.where(type: 'NonPlayerCharacter')
  end

  private

  def generate_slug
    slug_from_string "#{campaign.slug}-#{name.parameterize}"
  end

  def slug_from_string(slug_string)
    class_num = 0
    new_slug = slug_string
    loop do
      new_slug = slug_string if class_num == 0
      new_slug = "#{slug_string}-#{class_num}" if class_num > 0
      break unless Guild.exists?(slug: new_slug)

      class_num += 1
    end
    new_slug
  end
end
