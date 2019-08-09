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
  after_validation(on: :create) do
    self.slug = generate_slug
  end
  
  has_many :campaign_users, dependent: :destroy
  has_many :users, through: :campaign_users
  
  has_many :campaign_characters, dependent: :destroy
  has_many :characters, through: :campaign_characters

  belongs_to :user
  
  def pcs_count
    self.characters.where(character_type: 'pc').count
  end
  
  def npcs_count
    self.characters.where(character_type: 'npc').count
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
    self.slug = Campaign.exists?(self.name.parameterize) ? "#{self.name.parameterize}-#{self.user.username}-#{self.id}" : "#{self.name.parameterize}-#{self.user.username}"
  end
end
