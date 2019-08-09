# == Schema Information
#
# Table name: treasures
#
#  id              :bigint           not null, primary key
#  copper_pieces   :integer
#  description     :text
#  electrum_pieces :integer
#  gold_pieces     :integer
#  name            :string
#  platinum_pieces :integer
#  silver_pieces   :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#  user_id         :bigint
#
# Indexes
#
#  index_treasures_on_user_id  (user_id)
#

class Treasure < ApplicationRecord
  validates :name, presence: true

  has_many :equipment_items, inverse_of: :treasure

  has_many :treasure_magic_items, dependent: :destroy
  has_many :magic_items, through: :treasure_magic_items
  
  belongs_to :user
  belongs_to :monster, optional: true
  
  accepts_nested_attributes_for :equipment_items, reject_if: :all_blank, allow_destroy: true
  
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
