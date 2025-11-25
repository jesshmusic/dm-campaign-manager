# == Schema Information
#
# Table name: widgets
#
#  id         :bigint           not null, primary key
#  content    :text
#  icon       :text
#  subtitle   :text
#  title      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#
# Indexes
#
#  index_widgets_on_user_id  (user_id)
#
class Widget < ApplicationRecord
  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    title: 'A',
                    subtitle: 'B',
                    content: 'C'
                  },
                  using: {
                    tsearch: {
                      prefix: true
                    }
                  }
end
