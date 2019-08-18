# frozen_string_literal: true

# == Schema Information
#
# Table name: adventures
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  campaign_id :bigint
#
# Indexes
#
#  index_adventures_on_campaign_id  (campaign_id)
#
# Foreign Keys
#
#  fk_rails_...  (campaign_id => campaigns.id)
#

class Adventure < ApplicationRecord
  belongs_to :campaign

  has_many :encounters, dependent: :destroy

  has_many :character_adventures, dependent: :destroy
  has_many :characters, through: :character_adventures

  has_one :adventure_world_location, dependent: :destroy

  accepts_nested_attributes_for :encounters, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :adventure_world_location

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    description: 'B'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end
