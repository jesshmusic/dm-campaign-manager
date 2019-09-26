# frozen_string_literal: true

# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer          default(10)
#  challenge_rating       :string
#  charisma               :integer          default(10), not null
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution           :integer          default(10), not null
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity              :integer          default(10), not null
#  dexterity_save         :integer
#  hit_dice_modifier      :integer          default(0)
#  hit_dice_number        :integer          default(1), not null
#  hit_dice_value         :integer          default(8), not null
#  hit_points             :integer          default(8), not null
#  initiative             :integer          default(0), not null
#  intelligence           :integer          default(10), not null
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
#  speed                  :string           default("30 feet"), not null
#  strength               :integer          default(10), not null
#  strength_save          :integer
#  wisdom                 :integer          default(10), not null
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

  has_many :monster_actions, dependent: :destroy
  has_many :monster_legendary_actions, dependent: :destroy
  has_many :monster_special_abilities, dependent: :destroy
  has_many :skills, dependent: :destroy

  belongs_to :user, optional: true

  accepts_nested_attributes_for :monster_actions, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :monster_legendary_actions, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :monster_special_abilities, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :skills, reject_if: :all_blank, allow_destroy: true

  def description_text
    monster_desc = [
      '<div class="p-3">',
      "<h5><em>#{size}</em> #{monster_type} #{monster_subtype if monster_subtype && monster_subtype != ''}</h5>",
      "<h6>Alignment: <strong>#{alignment}</strong></h6>",
      "<h6>Challenge Rating: #{challenge_rating}</h6>",
      "<p><strong>Armor Class</strong>  #{armor_class}</p>",
      "<p><strong>Hit Points</strong>  #{hit_points}</p>",
      "<p><strong>Speed</strong>  #{speed}</p>",
      "<table class='table'><thead><tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead>",
      "<tbody><tr><td>#{strength}</td><td>#{dexterity}</td><td>#{constitution}</td><td>#{intelligence}</td><td>#{wisdom}</td><td>#{charisma}</td></tr></tbody></table>",
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

  def hit_dice
    if hit_dice_modifier < 0
      "#{hit_dice_number}d#{hit_dice_value} #{hit_dice_modifier}"
    elsif hit_dice_modifier > 0
      "#{hit_dice_number}d#{hit_dice_value} + #{hit_dice_modifier}"
    else
      "#{hit_dice_number}d#{hit_dice_value}"
    end
  end

  def xp
    DndRules.xp_for_cr(challenge_rating)
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    monster_type: 'B',
                    monster_subtype: 'C',
                    challenge_rating: 'D',
                    alignment: 'E'
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
