# == Schema Information
#
# Table name: foundry_maps
#
#  id               :bigint           not null, primary key
#  access_level     :string           default("premium"), not null
#  description      :text
#  download_count   :integer          default(0)
#  grid_size        :integer
#  grid_units       :string
#  height           :integer
#  keywords         :json
#  name             :string           not null
#  published        :boolean          default(FALSE)
#  required_tier    :string           default("free")
#  thumbnail_s3_key :string
#  thumbnail_url    :string
#  width            :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#
# Indexes
#
#  index_foundry_maps_on_access_level  (access_level)
#  index_foundry_maps_on_created_at    (created_at)
#  index_foundry_maps_on_published     (published)
#
class FoundryMap < ApplicationRecord
  # Associations
  has_many :foundry_map_taggings, dependent: :destroy
  has_many :foundry_map_tags, through: :foundry_map_taggings
  has_many :foundry_map_files, dependent: :destroy

  # Validations
  validates :name, presence: true
  validates :access_level, presence: true, inclusion: { in: %w[free premium] }

  # Scopes
  scope :published, -> { where(published: true) }
  scope :free, -> { where(access_level: 'free') }
  scope :premium, -> { where(access_level: 'premium') }
  scope :recent, -> { order(created_at: :desc) }

  # Methods
  def free?
    access_level == 'free'
  end

  def premium?
    access_level == 'premium'
  end

  def increment_downloads!
    increment!(:download_count)
  end

  def generate_thumbnail_signed_url(expires_in: 3600)
    return nil unless thumbnail_s3_key.present?

    s3_client = Aws::S3::Client.new(
      region: ENV['AWS_REGION'] || 'us-east-1',
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )

    signer = Aws::S3::Presigner.new(client: s3_client)
    signer.presigned_url(
      :get_object,
      bucket: ENV['AWS_S3_BUCKET'],
      key: thumbnail_s3_key,
      expires_in: expires_in
    )
  end

  def as_json_for_api
    {
      id: id.to_s,
      name: name,
      description: description,
      thumbnail: thumbnail_url, # Public URL - no expiry
      tags: foundry_map_tags.pluck(:name),
      keywords: keywords || [],
      access: access_level.capitalize,
      requiredTier: required_tier || 'free',
      published: published,
      gridSize: grid_size,
      gridUnits: grid_units,
      resolution: {
        width: width,
        height: height
      }.compact,
      createdAt: created_at.iso8601,
      updatedAt: updated_at.iso8601
    }.compact
  end
end
