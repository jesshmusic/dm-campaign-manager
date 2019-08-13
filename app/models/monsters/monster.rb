# frozen_string_literal: true

# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  challenge_rating       :string
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity_save         :integer
#  intelligence_save      :integer
#  languages              :string
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  reactions              :text
#  senses                 :string
#  size                   :string
#  slug                   :string
#  strength_save          :integer
#  wisdom_save            :integer
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  user_id                :bigint
#
# Indexes
#
#  index_monsters_on_slug     (slug) UNIQUE
#  index_monsters_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

class Monster < ApplicationRecord
  validates :name, :alignment, :challenge_rating, :monster_type, presence: true
  after_validation(on: :create) do
    self.slug = generate_slug
  end

  has_one :stat_block, dependent: :destroy
  accepts_nested_attributes_for :stat_block

  has_many :monster_actions, dependent: :destroy
  has_many :monster_legendary_actions, dependent: :destroy
  has_many :monster_special_abilities, dependent: :destroy
  has_many :skills, dependent: :destroy

  belongs_to :user, optional: true

  accepts_nested_attributes_for :monster_actions, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :monster_legendary_actions, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :monster_special_abilities, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :skills, reject_if: :all_blank, allow_destroy: true

  def hit_dice
    if stat_block.hit_dice_modifier < 0
      "#{stat_block.hit_dice_number}d#{stat_block.hit_dice_value} #{stat_block.hit_dice_modifier}"
    elsif stat_block.hit_dice_modifier > 0
      "#{stat_block.hit_dice_number}d#{stat_block.hit_dice_value} + #{stat_block.hit_dice_modifier}"
    else
      "#{stat_block.hit_dice_number}d#{stat_block.hit_dice_value}"
    end
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    challenge_rating: 'B',
                    alignment: 'C'
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
                  Monster.exists?(name.parameterize) ? "#{name.parameterize}-#{user.username}-#{id}" : "#{name.parameterize}-#{user.username}"
                else
                  Monster.exists?(name.parameterize) ? "#{name.parameterize}-#{id}" : name.parameterize.to_s
                end
  end
end
