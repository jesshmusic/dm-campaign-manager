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
#  traits                       :jsonb            is an Array
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
  validates :name, :speed, :strength_modifier, :dexterity_modifier, :constitution_modifier,
            :intelligence_modifier, :wisdom_modifier, :charisma_modifier,
            presence: true

  before_validation do
    self.slug = generate_slug if will_save_change_to_name?
  end

  has_and_belongs_to_many :profs
  has_many :ability_bonus_options, dependent: :destroy
  belongs_to :user, optional: true

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: { name: 'A' },
                  using: { tsearch: { prefix: true } }

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug = if user && !user.admin?
                  slug_from_string "#{name.parameterize}-#{user.username}"
                else
                  slug_from_string name.parameterize
                end
  end

  def slug_from_string(slug_string)
    class_num = 0
    new_slug = slug_string
    loop do
      new_slug = slug_string if class_num == 0
      new_slug = "#{slug_string}-#{class_num}" if class_num > 0
      break unless Race.exists?(slug: new_slug)

      class_num += 1
    end
    new_slug
  end
end
