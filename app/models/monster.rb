# == Schema Information
#
# Table name: monsters
#
#  id                     :bigint           not null, primary key
#  alignment              :string
#  api_url                :string
#  armor_class            :integer
#  challenge_rating       :string
#  charisma               :integer
#  charisma_save          :integer
#  condition_immunities   :string
#  constitution           :integer
#  constitution_save      :integer
#  damage_immunities      :string
#  damage_resistances     :string
#  damage_vulnerabilities :string
#  dexterity              :integer
#  dexterity_save         :integer
#  hit_dice               :string
#  hit_points             :integer
#  intelligence           :integer
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
#  speed                  :string
#  strength               :integer
#  strength_save          :integer
#  wisdom                 :integer
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
  
  validates :name, :alignment, :armor_class, :challenge_rating, :charisma, :constitution,
    :dexterity, :hit_dice, :hit_points, :intelligence, :monster_type, :size, :strength, :wisdom, presence: true

  has_many :monster_actions, dependent: :delete_all
  has_many :monster_legendary_actions, dependent: :delete_all
  has_many :monster_special_abilities, dependent: :delete_all
  has_many :skills, dependent: :delete_all

  belongs_to :user, optional: true
  
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
end
