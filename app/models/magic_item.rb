# == Schema Information
#
# Table name: magic_items
#
#  id                  :bigint           not null, primary key
#  description         :text
#  magic_item_type     :string
#  name                :string
#  rarity              :string
#  requires_attunement :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#

class MagicItem < ApplicationRecord
  include PgSearch
  
  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    magic_item_type: 'B',
                    rarity: 'C'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end
