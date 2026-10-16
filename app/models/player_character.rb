# frozen_string_literal: true

# == Schema Information
#
# Table name: player_characters
#
#  id           :bigint           not null, primary key
#  foundry_uuid :string           not null
#  level        :integer
#  name         :string           not null
#  player_name  :string
#  sheet        :jsonb            not null
#  world_title  :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#  world_id     :string           not null
#
# Indexes
#
#  idx_on_user_id_world_id_foundry_uuid_9ad0edfc57  (user_id,world_id,foundry_uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

# A player character from one of the DM's Foundry worlds, sent by Dorman
# Lakely's Campaign Planner. Foundry owns the sheet; Dungeon Master Guru keeps
# a read-only copy that campaigns pick their party from. The sheet holds what
# the player built (stats, class levels, and the names of spells, features
# and gear), never rules text from the books.
class PlayerCharacter < ApplicationRecord
  MAX_PER_WORLD = 50
  MAX_SHEET_BYTES = 100_000
  # A world actor, e.g. Actor.a1B2c3D4e5F6g7H8
  UUID_FORMAT = /\AActor\.[A-Za-z0-9]{16}\z/
  # A Foundry world's id, e.g. "greyhawk-campaign"
  WORLD_ID_FORMAT = /\A[\w-]{1,100}\z/

  belongs_to :user
  has_many :party_memberships, class_name: 'CampaignPartyMember', dependent: :delete_all

  validates :world_id, format: { with: WORLD_ID_FORMAT }
  validates :world_title, length: { maximum: 200 }
  validates :foundry_uuid, format: { with: UUID_FORMAT }, uniqueness: { scope: %i[user_id world_id] }
  validates :name, presence: true, length: { maximum: 120 }
  validates :player_name, length: { maximum: 120 }
  validates :level, numericality: { only_integer: true, in: 0..30 }, allow_nil: true
  validate :sheet_is_a_small_object

  # Replaces the user's characters from one world with the ones the module
  # sent. Existing characters keep their ids, so campaigns keep them in their
  # party; one no longer in the world leaves every party. Skips characters
  # that aren't valid. Returns how many were saved.
  def self.replace_world!(user, world_id, world_title, characters)
    transaction do
      saved = save_from_world!(user, world_id, world_title, characters)
      sent = characters.filter_map { |character| character['uuid'].to_s if character.is_a?(Hash) }
      user.player_characters.where(world_id: world_id).where.not(foundry_uuid: sent).destroy_all
      saved.size
    end
  end

  # Saves these characters from a world, leaving its others alone (e.g. a new
  # campaign's party). Skips characters that aren't valid. Returns the saved ones.
  def self.save_from_world!(user, world_id, world_title, characters)
    characters.first(MAX_PER_WORLD).filter_map { |character| attributes_for(character) }
              .uniq { |attributes| attributes[:foundry_uuid] }
              .filter_map do |attributes|
                character = user.player_characters.find_or_initialize_by(world_id: world_id,
                                                                         foundry_uuid: attributes[:foundry_uuid])
                character if character.update(attributes.merge(world_title: world_title))
              end
  end

  def self.attributes_for(character)
    return unless character.is_a?(Hash) && character['sheet'].is_a?(Hash)

    {
      foundry_uuid: character['uuid'].to_s,
      name: character['name'].to_s.squish,
      player_name: character['playerName'].to_s.squish.presence,
      level: Integer(character['level'], exception: false),
      sheet: character['sheet']
    }
  end
  private_class_method :attributes_for

  # "Cleric (Life Domain)", or "Fighter 3 / Wizard 2" for a multiclass character
  def class_line
    classes = Array(sheet['classes']).select { |klass| klass.is_a?(Hash) && klass['name'].present? }
    classes.map do |klass|
      [klass['name'], ("(#{klass['subclass']})" if klass['subclass'].present?), (klass['levels'] if classes.size > 1)]
        .compact.join(' ')
    end.join(' / ')
  end

  # For lists: who the character is, without the sheet
  def as_summary_json_for_api
    {
      id: id.to_s,
      name: name,
      playerName: player_name,
      level: level,
      classes: class_line.presence,
      worldId: world_id,
      worldTitle: world_title.presence || world_id,
      updatedAt: updated_at.iso8601
    }
  end

  def as_json_for_api
    as_summary_json_for_api.merge(sheet: sheet)
  end

  private

  def sheet_is_a_small_object
    return errors.add(:sheet, 'must be an object') unless sheet.is_a?(Hash)

    errors.add(:sheet, 'is too large') if sheet.to_json.bytesize > MAX_SHEET_BYTES
  end
end
