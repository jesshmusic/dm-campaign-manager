# frozen_string_literal: true

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
#  slug                :string
#  created_at          :datetime         not null
#  updated_at          :datetime         not null
#  user_id             :bigint
#
# Indexes
#
#  index_magic_items_on_slug     (slug) UNIQUE
#  index_magic_items_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class MagicItem < ApplicationRecord
  validates :name, :magic_item_type, :rarity, presence: true

  after_validation(on: :create) do
    self.slug = generate_slug
  end

  include PgSearch::Model

  belongs_to :user, optional: true

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

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug = if user
                  MagicItem.exists?(name.parameterize) ? "#{name.parameterize}-#{user.username}-#{id}" : "#{name.parameterize}-#{user.username}"
                else
                  MagicItem.exists?(name.parameterize) ? "#{name.parameterize}-#{id}" : name.parameterize.to_s
                end
  end
end
