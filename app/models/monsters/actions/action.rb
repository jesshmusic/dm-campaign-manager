# == Schema Information
#
# Table name: actions
#
#  id         :bigint           not null, primary key
#  desc       :string
#  name       :string
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint
#
# Indexes
#
#  index_actions_on_monster_id  (monster_id)
#
# Foreign Keys
#
#  fk_rails_...  (monster_id => monsters.id)
#
class Action < ApplicationRecord
  belongs_to :monster, optional: true

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    desc: 'B'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end
