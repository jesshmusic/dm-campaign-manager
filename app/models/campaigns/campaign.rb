# frozen_string_literal: true

# == Schema Information
#
# Table name: campaigns
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  world       :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_campaigns_on_slug     (slug) UNIQUE
#  index_campaigns_on_user_id  (user_id)
#

class Campaign < ApplicationRecord
  validates :name, :world, presence: true
  before_save do
    self.slug = generate_slug
  end

  has_many :adventures, dependent: :destroy
  has_many :characters, dependent: :destroy
  has_many :world_locations, dependent: :destroy
  has_many :world_events, dependent: :destroy

  belongs_to :user

  accepts_nested_attributes_for :adventures, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :world_locations, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :world_events, reject_if: :all_blank, allow_destroy: true

  def pcs_count
    characters.where(type: 'PlayerCharacter').count
  end

  def npcs_count
    characters.where(type: 'NonPlayerCharacter').count
  end

  def pcs
    characters.where(type: 'PlayerCharacter')
  end

  def npcs
    characters.where(type: 'NonPlayerCharacter')
  end

  def dungeon_master
    user
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    world: 'C',
                    description: 'B'
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
    self.slug = Campaign.exists?(name.parameterize) ? "#{name.parameterize}-#{user.username}-#{id}" : "#{name.parameterize}-#{user.username}"
  end
end
