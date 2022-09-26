# frozen_string_literal: true

# == Schema Information
#
# Table name: races
#
#  id                           :bigint           not null, primary key
#  ability_bonus_option_choices :string           default([]), is an Array
#  ability_bonus_options        :integer
#  age                          :text
#  alignment                    :text
#  language_choices             :string           default([]), is an Array
#  language_description         :text
#  languages                    :string           default([]), is an Array
#  name                         :string           default("New Race..."), not null
#  size                         :string
#  size_description             :text
#  slug                         :string           not null
#  speed                        :integer
#  starting_languages           :integer
#  subraces                     :string           default([]), is an Array
#  created_at                   :datetime         not null
#  updated_at                   :datetime         not null
#  user_id                      :bigint
#
# Indexes
#
#  index_races_on_name     (name)
#  index_races_on_slug     (slug)
#  index_races_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class Race < ApplicationRecord
  validates :name, presence: true
  extend FriendlyId
  friendly_id :name, use: :slugged

  def normalize_friendly_id(string)
    super(string.gsub('\'', ''))
  end

  has_and_belongs_to_many :profs
  has_many :ability_bonus_options, dependent: :destroy
  has_many :race_traits, dependent: :destroy
  belongs_to :user, optional: true

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: { name: 'A' },
                  using: { tsearch: { prefix: true } }
end
