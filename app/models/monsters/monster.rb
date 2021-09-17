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
#  constitution           :integer          default(10), not null
#  damage_immunities      :string           default([]), is an Array
#  damage_resistances     :string           default([]), is an Array
#  damage_vulnerabilities :string           default([]), is an Array
#  dexterity              :integer          default(10), not null
#  hit_dice               :string
#  hit_points             :integer          default(8), not null
#  intelligence           :integer          default(10), not null
#  languages              :string
#  legendary_description  :text
#  monster_subtype        :string
#  monster_type           :string
#  name                   :string
#  size                   :string
#  slug                   :string
#  strength               :integer          default(10), not null
#  wisdom                 :integer          default(10), not null
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
  validates :name, :alignment, :challenge_rating, :monster_type, :slug, presence: true

  before_validation do
    self.slug = generate_slug if will_save_change_to_name?
  end

  has_many :actions, dependent: :destroy
  has_many :legendary_actions, dependent: :destroy
  has_many :reactions, dependent: :destroy
  has_many :special_abilities, dependent: :destroy

  has_many :senses, dependent: :destroy
  has_many :speeds, dependent: :destroy

  has_many :monster_proficiencies
  has_many :profs, through: :monster_proficiencies

  has_many :condition_immunities
  has_many :conditions, through: :condition_immunities

  belongs_to :user, optional: true

  accepts_nested_attributes_for :monster_proficiencies, allow_destroy: true
  accepts_nested_attributes_for :condition_immunities, allow_destroy: true

  def xp
    DndRules.xp_for_cr(challenge_rating)
  end

  def initiative
    DndRules.ability_score_modifier(dexterity)
  end

  def hit_die_string
    constitution_bonus = DndRules.ability_score_modifier(constitution)
    hit_dice_count = hit_dice.partition('d').first.to_i
    constitution_bonus = constitution_bonus * hit_dice_count
    modifier = constitution_bonus > 0 ? '+' : '-'
    additional = constitution_bonus != 0 ? "#{modifier} #{constitution_bonus.abs}" : ''
    "#{hit_dice} #{additional}"
  end

  def description_text
    monster_desc = [
      '<div class="p-3">',
      "<h5><em>#{size} #{monster_type} #{monster_subtype if monster_subtype && monster_subtype != ''}, #{alignment}</em></h5>",
      "<p><strong>Armor Class</strong>  #{armor_class}</p>",
      "<p><strong>Hit Points</strong>  #{hit_points} (#{hit_dice})</p>",
      "<p><strong>Speed</strong>  #{speed_string}</p>",
      '<table class=\'table\'><thead><tr><th>STR</th><th>DEX</th><th>CON</th><th>INT</th><th>WIS</th><th>CHA</th></tr></thead>',
      "<tbody><tr><td>#{strength}</td><td>#{dexterity}</td><td>#{constitution}</td><td>#{intelligence}</td><td>#{wisdom}</td><td>#{charisma}</td></tr></tbody></table>"
    ]

    unless monster_proficiencies.empty?
      saving_throws_desc = '<p><strong>Saving Throws </strong>'
      skills_desc = '<p><strong>Skills </strong>'
      saving_throws_arr = []
      skills_arr = []
      monster_proficiencies.each do |monster_prof|
        prof = monster_prof.prof
        case prof.prof_type
        when 'Saving Throws'
          saving_throws_arr << "<span>#{prof.name.gsub('Saving Throw: ', '').titlecase} #{monster_prof.value >= 0 ? '+' : ''}#{monster_prof.value} </span>"
        when 'Skills'
          skills_arr << "<span>#{prof.name.gsub('Skill: ', '').titlecase} #{monster_prof.value >= 0 ? '+' : ''}#{monster_prof.value} </span>"
        end
      end
      saving_throws_desc += "#{saving_throws_arr.join(', ')}</p>"
      skills_desc += "#{skills_arr.join(', ')}</p>"
      monster_desc << saving_throws_desc
      monster_desc << skills_desc
    end

    monster_desc << "<p><strong>Damage Vulnerabilities</strong>  #{damage_vulnerabilities.join(', ')}</p>" unless damage_vulnerabilities.empty?
    monster_desc << "<p><strong>Damage Resistances</strong>  #{damage_resistances.join(', ')}</p>" unless damage_resistances.empty?
    monster_desc << "<p><strong>Damage Immunities</strong>  #{damage_immunities.join(', ')}</p>" unless damage_immunities.empty?
    unless condition_immunities.empty?
      monster_desc << '<h5 class="mt-3">Skills</h5>'
      condition_immunities.each do |cond_imm|
        monster_desc << "<p>#{cond_imm.condition.name}</p>"
      end
    end

    monster_desc << "<p><strong>Senses</strong>  #{senses_string}</p>"
    monster_desc << "<p><strong>Languages</strong>  #{languages}</p>"
    monster_desc << "<p><strong>Challenge</strong> #{challenge_rating} (#{format_number(xp)} XP)</p>"

    unless actions.empty?
      monster_desc << '<h5 class="mt-3">Actions</h5>'
      actions.each do |monster_action|
        monster_desc << "<h6 class=\"mt-2\">#{monster_action['name']}</h6><div>#{monster_action['desc']}</div>"
      end
    end

    unless special_abilities.empty?
      monster_desc << '<h5 class="mt-3">Special Abilities</h5>'
      special_abilities.each do |monster_action|
        monster_desc << "<h6 class=\"mt-2\">#{monster_action['name']}</h6><div>#{monster_action['desc']}</div>"
      end
    end

    unless legendary_actions.empty?
      monster_desc << '<h5 class="mt-3">Legendary Actions</h5>'
      monster_desc << legendary_description
      legendary_actions.each do |monster_action|
        monster_desc << "<h6 class=\"mt-2\">#{monster_action['name']}</h6><div>#{monster_action['desc']}</div>"
      end
    end

    monster_desc << '</div>'

    monster_desc.join
  end

  def speed_string
    speeds = []
    speeds << speed['walk'].to_s unless speed['walk'] == ''
    speeds << "fly #{speed['fly']}" unless speed['fly'] == ''
    speeds << "swim #{speed['swim']}" unless speed['swim'] == ''
    speeds << "climb #{speed['climb']}" unless speed['climb'] == ''
    speeds << "burrow #{speed['burrow']}" unless speed['burrow'] == ''
    speeds << 'hover' unless speed['hover'] == false || speed['hover'] == '0'
    speeds.join(', ')
  end

  def senses_string
    senses_arr = []
    senses_arr << "darkvision #{senses['darkvision']}" if senses['darkvision']
    senses_arr << "blindsight #{senses['blindsight']}" if senses['blindsight']
    senses_arr << "passive perception #{senses['passive_perception']}" if senses['passive_perception']
    senses_arr << "tremorsense #{senses['tremorsense']}" if senses['tremorsense']
    senses_arr << "truesight #{senses['truesight']}" if senses['truesight']
    senses_arr.join(', ')
  end

  def format_number(number)
    num_groups = number.to_s.chars.to_a.reverse.each_slice(3)
    num_groups.map(&:join).join(',').reverse
  end

  include PgSearch::Model

  # PgSearch
  pg_search_scope :search_for,
                  against: {
                    name: 'A',
                    monster_type: 'B',
                    challenge_rating: 'C',
                    alignment: 'D'
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
      new_slug = slug_string if class_num.zero?
      new_slug = "#{slug_string}-#{class_num}" if class_num.positive?
      break unless Monster.exists?(slug: new_slug)

      class_num += 1
    end
    new_slug
  end
end
