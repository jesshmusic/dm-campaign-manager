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

  def description_text
    monster_desc = [
      "###_#{size}_ #{monster_type} #{monster_subtype if monster_subtype && monster_subtype != ''}",
      "####Challenge Rating: #{challenge_rating}\n",
      "**Armor Class**  #{stat_block.armor_class}",
      "**Hit Points**  #{stat_block.hit_points}",
      "**Speed**  #{stat_block.speed}",
      "| STR | DEX | CON | INT | WIS | CHA |",
      "|:---:|:---:|:---:|:---:|:---:|:---:|",
      "|  #{stat_block.strength} |  #{stat_block.dexterity} |  #{stat_block.constitution} |  #{stat_block.intelligence} |  #{stat_block.wisdom} |  #{stat_block.charisma} |\n",
      "**Senses** #{senses}",
      "**Languages** #{languages}"
    ]

    monster_desc << "**Damage Vulnerabilities**  #{damage_vulnerabilities}" if damage_vulnerabilities
    monster_desc << "**Damage Resistances**  #{damage_resistances}" if damage_resistances
    monster_desc << "**Damage Immunities**  #{damage_immunities}" if damage_immunities
    monster_desc << "**Condition Immunities**  #{condition_immunities}" if condition_immunities

    unless skills.empty?
      monster_desc << "\n####Skills"
      skills.each do |skill|
        monster_desc << "**#{skill.name.capitalize}** #{skill.score}"
      end
    end

    unless monster_actions.empty?
      monster_desc << "\n####Actions"
      monster_actions.each do |monster_action|
        monster_desc << "**#{monster_action.name}** \n#{monster_action.description}\n"
        monster_desc << "**Attack Bonus** +#{monster_action.attack_bonus} | **Damage Bonus** +#{monster_action.damage_bonus} | **Damage Dice** +#{monster_action.damage_dice}"
      end
    end

    unless monster_special_abilities.empty?
      monster_desc << "\n####Special Abilities"
      monster_special_abilities.each do |monster_action|
        monster_desc << "**#{monster_action.name}** \n#{monster_action.description}\n"
      end
    end

    unless monster_legendary_actions.empty?
      monster_desc << "\n####Legendary Actions"
      monster_desc << legendary_description
      monster_legendary_actions.each do |monster_action|
        monster_desc << "**#{monster_action.name}** \n#{monster_action.description}\n"
      end
    end

    monster_desc.join('\n')
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
