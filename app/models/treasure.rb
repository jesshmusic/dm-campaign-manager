# == Schema Information
#
# Table name: treasures
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer
#  description     :text
#  gold_pieces     :integer
#  name            :string
#  platinum_pieces :integer
#  silver_pieces   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  monster_id      :bigint
#  user_id         :bigint
#
# Indexes
#
#  index_treasures_on_monster_id  (monster_id)
#  index_treasures_on_user_id     (user_id)
#

class Treasure < ApplicationRecord
  validates :name, presence: true

  has_many :treasure_items, dependent: :delete_all
  has_many :items, through: :treasure_items

  has_many :treasure_magic_items, dependent: :delete_all
  has_many :magic_items, through: :treasure_magic_items
  
  belongs_to :user
  belongs_to :monster, optional: true
  
  include PgSearch::Model
  
  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end
