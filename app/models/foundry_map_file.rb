# == Schema Information
#
# Table name: foundry_map_files
#
#  id             :bigint           not null, primary key
#  content_type   :string
#  file_path      :string           not null
#  file_size      :bigint
#  file_type      :string           not null
#  s3_key         :string           not null
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  foundry_map_id :bigint           not null
#
# Indexes
#
#  index_foundry_map_files_on_file_type       (file_type)
#  index_foundry_map_files_on_foundry_map_id  (foundry_map_id)
#  index_foundry_map_files_on_s3_key          (s3_key) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (foundry_map_id => foundry_maps.id)
#
class FoundryMapFile < ApplicationRecord
  # Associations
  belongs_to :foundry_map

  # Valid file types for Foundry scenes
  FILE_TYPES = %w[scene background tile token audio thumbnail other].freeze

  # Validations
  validates :file_path, presence: true
  validates :file_type, presence: true, inclusion: { in: FILE_TYPES }
  validates :s3_key, presence: true, uniqueness: true

  # Scopes
  scope :scenes, -> { where(file_type: 'scene') }
  scope :backgrounds, -> { where(file_type: 'background') }
  scope :tiles, -> { where(file_type: 'tile') }
  scope :tokens, -> { where(file_type: 'token') }
  scope :audio, -> { where(file_type: 'audio') }
  scope :thumbnails, -> { where(file_type: 'thumbnail') }

  # Methods
  def file_name
    File.basename(file_path)
  end

  def as_json_for_api
    {
      id: id.to_s,
      file_name: file_name,
      file_path: file_path,
      file_type: file_type,
      file_size: file_size || 0,
      s3_key: s3_key,
      signed_url: generate_signed_url(expires_in: 3600),
      path: file_path,  # Keep for backward compatibility with Foundry module
      size: file_size || 0,  # Keep for backward compatibility
      type: file_type  # Keep for backward compatibility
    }
  end

  def generate_signed_url(expires_in: 3600)
    s3_client = Aws::S3::Client.new(
      region: ENV['AWS_REGION'] || 'us-east-1',
      access_key_id: ENV['AWS_ACCESS_KEY_ID'],
      secret_access_key: ENV['AWS_SECRET_ACCESS_KEY']
    )

    signer = Aws::S3::Presigner.new(client: s3_client)
    signer.presigned_url(
      :get_object,
      bucket: ENV['AWS_S3_BUCKET'],
      key: s3_key,
      expires_in: expires_in
    )
  end
end
