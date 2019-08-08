# == Schema Information
#
# Table name: characters
#
#  id                 :bigint           not null, primary key
#  alignment          :string
#  armor_class        :integer
#  character_type     :string           not null
#  charisma           :integer
#  constitution       :integer
#  copper_pieces      :integer
#  description        :text
#  dexterity          :integer
#  electrum_pieces    :integer
#  gold_pieces        :integer
#  hit_points         :integer
#  hit_points_current :integer
#  initiative         :integer
#  intelligence       :integer
#  languages          :string
#  level              :integer
#  name               :string           not null
#  platinum_pieces    :integer
#  proficiency        :integer
#  race               :string
#  role               :string
#  silver_pieces      :integer
#  slug               :string           not null
#  speed              :string
#  spell_ability      :string
#  spell_attack_bonus :integer
#  spell_save_dc      :integer
#  strength           :integer
#  wisdom             :integer
#  xp                 :integer
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  campaign_id        :bigint
#  user_id            :bigint
#
# Indexes
#
#  index_characters_on_campaign_id  (campaign_id)
#  index_characters_on_slug         (slug)
#  index_characters_on_user_id      (user_id)
#

class Character < ApplicationRecord
  after_validation(on: :create) do
    self.slug = generate_slug
  end
  
  has_many :equipment_items, inverse_of: :character
  has_many :skills, dependent: :delete_all
  has_many :treasures, dependent: :delete_all

  has_many :character_magic_items, dependent: :delete_all
  has_many :magic_items, through: :character_magic_items
  
  has_many :character_spells, dependent: :delete_all
  has_many :spells, through: :character_spells
  
  accepts_nested_attributes_for :equipment_items, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :skills, reject_if: :all_blank, allow_destroy: true
  accepts_nested_attributes_for :treasures, reject_if: :all_blank, allow_destroy: true
  
  belongs_to :user
  belongs_to :campaign
  
  include PgSearch::Model
  
  # PgSearch
  pg_search_scope :search_for,
    against: { name: 'A', description: 'B' },
    using: { tsearch: { prefix: true } }

  def to_param
    slug
  end
  
  private

  def generate_slug
    self.slug = Character.exists?(self.name.parameterize) ? "#{self.name.parameterize}-#{self.id}" : self.name.parameterize
  end
end
