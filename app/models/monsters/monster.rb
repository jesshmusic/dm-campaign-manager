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
      '<div class="p-3">',
      "<h5><em>#{size}</em> #{monster_type} #{monster_subtype if monster_subtype && monster_subtype != ''}</h5>",
      "<h6>Challenge Rating: #{challenge_rating}</h6>",
      "<p><strong>Armor Class</strong>  #{stat_block.armor_class}</p>",
      "<p><strong>Hit Points</strong>  #{stat_block.hit_points}</p>",
      "<p><strong>Speed</strong>  #{stat_block.speed}</p>",
      "<table class='table'><thead><tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead>",
      "<tbody><tr><td>#{stat_block.strength}</td><td>#{stat_block.dexterity}</td><td>#{stat_block.constitution}</td><td>#{stat_block.intelligence}</td><td>#{stat_block.wisdom}</td><td>#{stat_block.charisma}</td></tr></tbody></table>",
      "<p><strong>Senses</strong>  #{senses}</p>",
      "<p><strong>Languages</strong>  #{languages}</p>"
    ]

    monster_desc << "<p><strong>Damage Vulnerabilities</strong>  #{damage_vulnerabilities}</p>" if damage_vulnerabilities && damage_vulnerabilities != ''
    monster_desc << "<p><strong>Damage Resistances</strong>  #{damage_resistances}</p>" if damage_resistances && damage_resistances != ''
    monster_desc << "<p><strong>Damage Immunities</strong>  #{damage_immunities}</p>" if damage_immunities && damage_immunities != ''
    monster_desc << "<p><strong>Condition Immunities</strong>  #{condition_immunities}</p>" if condition_immunities && condition_immunities != ''

    unless skills.empty?
      monster_desc << '<h5 class="mt-3">Skills</h5>'
      skills.each do |skill|
        monster_desc << "<p><strong>#{skill.name.capitalize}</strong>  #{skill.score}</p>"
      end
    end

    unless monster_actions.empty?
      monster_desc << '<h5 class="mt-3">Actions</h5>'
      monster_actions.each do |monster_action|
        monster_desc << "<h6 class=\"mt-2\">#{monster_action.name}</h6><div>#{monster_action.description}</div>"
        monster_desc << "<p><strong>Attack Bonus</strong> +#{monster_action.attack_bonus} | <strong>Damage Bonus</strong> +#{monster_action.damage_bonus} | <strong>Damage Dice</strong> #{monster_action.damage_dice}</p>"
      end
    end

    unless monster_special_abilities.empty?
      monster_desc << '<h5 class="mt-3">Special Abilities</h5>'
      monster_special_abilities.each do |monster_action|
        monster_desc << "<h6 class=\"mt-2\">#{monster_action.name}</h6><div>#{monster_action.description}</div>"
      end
    end

    unless monster_legendary_actions.empty?
      monster_desc << '<h5 class="mt-3">Legendary Actions</h5>'
      monster_desc << legendary_description
      monster_legendary_actions.each do |monster_action|
        monster_desc << "<h6 class=\"mt-2\">#{monster_action.name}</h6><div>#{monster_action.description}</div>"
      end
    end

    monster_desc << '</div>'

    monster_desc.join
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
