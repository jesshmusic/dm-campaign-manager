# == Schema Information
#
# Table name: player_characters
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_player_characters_on_user_id  (user_id)
#

class PlayerCharacter < ApplicationRecord
  has_one :character_stat, dependent: :destroy
  has_many :equipment_items, inverse_of: :player_character
  
  belongs_to :user
  
  include PgSearch::Model
  
  # PgSearch
  pg_search_scope :search_for,
    against: { name: 'A', description: 'B' },
    using: { tsearch: { prefix: true } }

  def to_param
    slug
  end
end
