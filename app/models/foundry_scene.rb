# frozen_string_literal: true

# == Schema Information
#
# Table name: foundry_scenes
#
#  id               :bigint           not null, primary key
#  foundry_uuid     :string           not null
#  name             :string           not null
#  thumbnail_s3_key :string           not null
#  thumbnail_url    :string           not null
#  version          :string           not null
#  world_title      :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  user_id          :bigint           not null
#  world_id         :string           not null
#
# Indexes
#
#  index_foundry_scenes_on_user_id_and_foundry_uuid               (user_id,foundry_uuid)
#  index_foundry_scenes_on_user_id_and_world_id_and_foundry_uuid  (user_id,world_id,foundry_uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

# A thumbnail of a scene from one of the DM's Foundry worlds. Dorman Lakely's
# Campaign Planner sends one for each scene a campaign uses as a map (a
# place's map, or one of a session's maps), so the maps show here while
# Foundry is closed. The image is in S3's public thumbnails path; the scene
# itself stays in Foundry.
class FoundryScene < ApplicationRecord
  class InvalidThumbnail < StandardError; end

  MAX_PER_WORLD = 500
  MAX_THUMBNAIL_BYTES = 500_000
  # A world scene, e.g. Scene.a1B2c3D4e5F6g7H8
  UUID_FORMAT = /\AScene\.[A-Za-z0-9]{16}\z/
  DATA_URL = %r{\Adata:(image/[a-z]+);base64,([A-Za-z0-9+/]+={0,2})\z}
  # The image types Foundry makes thumbnails in, and the bytes each starts with
  IMAGE_TYPES = {
    'image/webp' => { extension: 'webp', signature: /\ARIFF.{4}WEBP/mn },
    'image/jpeg' => { extension: 'jpg', signature: /\A\xFF\xD8\xFF/n },
    'image/png' => { extension: 'png', signature: /\A\x89PNG\r\n\x1A\n/n }
  }.freeze

  belongs_to :user

  validates :world_id, format: { with: PlayerCharacter::WORLD_ID_FORMAT }
  validates :world_title, length: { maximum: 200 }
  validates :foundry_uuid, format: { with: UUID_FORMAT }, uniqueness: { scope: %i[user_id world_id] }
  validates :name, presence: true, length: { maximum: 200 }
  validates :version, presence: true, length: { maximum: 100 }
  validates :thumbnail_s3_key, :thumbnail_url, presence: true

  after_destroy_commit { PublicThumbnailStore.delete(thumbnail_s3_key) }

  # { scene uuid => thumbnail URL } for these scenes of the user's. A scene in
  # two worlds (e.g. both imported the same adventure) shows the latest one.
  def self.thumbnail_urls(user, uuids)
    return {} if uuids.blank?

    where(user: user, foundry_uuid: uuids).order(:updated_at).pluck(:foundry_uuid, :thumbnail_url).to_h
  end

  # Saves a scene from a world with its thumbnail, a data URL. Uploads the
  # image only when the scene is new or its version changed, then deletes the
  # one it replaces. Raises InvalidThumbnail or ActiveRecord::RecordInvalid.
  # @param world [Hash] { id:, title: }
  # @param sent [Hash] { uuid:, name:, version:, thumbnail: }
  def self.save_from_world!(user, world, sent)
    scene = user.foundry_scenes.find_or_initialize_by(world_id: world[:id], foundry_uuid: sent[:uuid])
    unchanged = scene.persisted? && scene.version == sent[:version]
    scene.assign_attributes(world_title: world[:title], name: sent[:name], version: sent[:version])
    return scene.tap(&:save!) if unchanged

    scene.check_before_upload!
    scene.upload_thumbnail!(sent[:thumbnail])
    scene
  end

  def as_json_for_api
    { uuid: foundry_uuid, name: name, version: version, thumbnailUrl: thumbnail_url, worldId: world_id }
  end

  # Everything but the thumbnail must be valid before it's uploaded
  def check_before_upload!
    validate
    errors.delete(:thumbnail_s3_key)
    errors.delete(:thumbnail_url)
    raise ActiveRecord::RecordInvalid, self if errors.any?
    return unless new_record? && user.foundry_scenes.where(world_id: world_id).count >= MAX_PER_WORLD

    raise InvalidThumbnail, "A world can have up to #{MAX_PER_WORLD} scene thumbnails"
  end

  def upload_thumbnail!(data_url)
    content_type, bytes = self.class.decode_thumbnail(data_url)
    replaced = thumbnail_s3_key
    path = "scenes/#{user_id}/#{SecureRandom.uuid}.#{IMAGE_TYPES[content_type][:extension]}"
    uploaded = PublicThumbnailStore.put(path, bytes, content_type)
    begin
      update!(thumbnail_s3_key: uploaded[:key], thumbnail_url: uploaded[:url])
    rescue ActiveRecord::RecordInvalid
      PublicThumbnailStore.delete(uploaded[:key])
      raise
    end
    PublicThumbnailStore.delete(replaced) if replaced
  end

  # [content type, bytes] from a data URL, checking it really is a small image
  def self.decode_thumbnail(data_url)
    match = DATA_URL.match(data_url.to_s)
    raise InvalidThumbnail, 'The thumbnail must be a WebP, JPEG or PNG data URL' unless match && IMAGE_TYPES.key?(match[1])
    raise InvalidThumbnail, 'The thumbnail is too large' if match[2].length * 3 / 4 > MAX_THUMBNAIL_BYTES

    bytes = Base64.strict_decode64(match[2])
    raise InvalidThumbnail, "The thumbnail isn't a #{match[1]} image" unless bytes.match?(IMAGE_TYPES[match[1]][:signature])

    [match[1], bytes]
  rescue ArgumentError
    raise InvalidThumbnail, "The thumbnail isn't valid base64"
  end
end
