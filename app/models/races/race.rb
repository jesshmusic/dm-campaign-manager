# frozen_string_literal: true

# == Schema Information
#
# Table name: races
#
#  id                    :bigint           not null, primary key
#  charisma_modifier     :integer          default(0), not null
#  constitution_modifier :integer          default(0), not null
#  dexterity_modifier    :integer          default(0), not null
#  intelligence_modifier :integer          default(0), not null
#  name                  :string           default("New Race..."), not null
#  slug                  :string           not null
#  speed                 :string           default("30 feet"), not null
#  strength_modifier     :integer          default(0), not null
#  wisdom_modifier       :integer          default(0), not null
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  user_id               :bigint
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
  after_validation(on: :create) do
    self.slug = generate_slug
  end

  belongs_to :user, optional: true

  def to_param
    slug
  end

  private

  def generate_slug
    self.slug = Race.exists?(name.parameterize) ? "race-#{name.parameterize}-#{id}" : "race-#{name.parameterize}"
  end
end
