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

require 'rails_helper'

RSpec.describe FoundryMapFile, type: :model do
  let(:foundry_map) { create(:foundry_map) }
  let(:foundry_map_file) { create(:foundry_map_file, foundry_map: foundry_map) }

  describe 'associations' do
    it { should belong_to(:foundry_map) }
  end

  describe 'validations' do
    it { should validate_presence_of(:file_path) }
    it { should validate_presence_of(:file_type) }
    it { should validate_presence_of(:s3_key) }
    it { should validate_inclusion_of(:file_type).in_array(FoundryMapFile::FILE_TYPES) }

    describe 's3_key uniqueness' do
      it 'validates uniqueness of s3_key' do
        file1 = create(:foundry_map_file, s3_key: 'unique/key/1.json')
        file2 = build(:foundry_map_file, s3_key: 'unique/key/1.json')

        expect(file2).not_to be_valid
        expect(file2.errors[:s3_key]).to include('has already been taken')
      end
    end
  end

  describe 'constants' do
    it 'defines FILE_TYPES' do
      expect(FoundryMapFile::FILE_TYPES).to eq(%w[scene background tile token audio thumbnail other])
    end
  end

  describe 'scopes' do
    let!(:scene_file) { create(:foundry_map_file, :scene) }
    let!(:background_file) { create(:foundry_map_file, :background) }
    let!(:tile_file) { create(:foundry_map_file, :tile) }
    let!(:token_file) { create(:foundry_map_file, :token) }
    let!(:audio_file) { create(:foundry_map_file, :audio) }
    let!(:thumbnail_file) { create(:foundry_map_file, :thumbnail) }

    it '.scenes returns only scene files' do
      expect(FoundryMapFile.scenes).to contain_exactly(scene_file)
    end

    it '.backgrounds returns only background files' do
      expect(FoundryMapFile.backgrounds).to contain_exactly(background_file)
    end

    it '.tiles returns only tile files' do
      expect(FoundryMapFile.tiles).to contain_exactly(tile_file)
    end

    it '.tokens returns only token files' do
      expect(FoundryMapFile.tokens).to contain_exactly(token_file)
    end

    it '.audio returns only audio files' do
      expect(FoundryMapFile.audio).to contain_exactly(audio_file)
    end

    it '.thumbnails returns only thumbnail files' do
      expect(FoundryMapFile.thumbnails).to contain_exactly(thumbnail_file)
    end
  end

  describe '#file_name' do
    it 'returns the base name of the file path' do
      file = create(:foundry_map_file, file_path: 'maps/dungeon/scene.json')
      expect(file.file_name).to eq('scene.json')
    end

    it 'handles paths without directories' do
      file = create(:foundry_map_file, file_path: 'scene.json')
      expect(file.file_name).to eq('scene.json')
    end
  end

  describe '#generate_signed_url' do
    let(:map_file) { create(:foundry_map_file, s3_key: 'maps/test/scene.json') }

    before do
      allow(ENV).to receive(:[]).and_call_original
      allow(ENV).to receive(:[]).with('AWS_REGION').and_return('us-east-1')
      allow(ENV).to receive(:[]).with('AWS_ACCESS_KEY_ID').and_return('test_access_key')
      allow(ENV).to receive(:[]).with('AWS_SECRET_ACCESS_KEY').and_return('test_secret_key')
      allow(ENV).to receive(:[]).with('AWS_S3_BUCKET').and_return('test-bucket')
    end

    it 'generates a signed URL' do
      allow_any_instance_of(Aws::S3::Presigner).to receive(:presigned_url).and_return('https://example.com/signed-url')

      url = map_file.generate_signed_url
      expect(url).to eq('https://example.com/signed-url')
    end

    it 'accepts custom expiry time' do
      presigner = instance_double(Aws::S3::Presigner)
      allow(Aws::S3::Presigner).to receive(:new).and_return(presigner)
      expect(presigner).to receive(:presigned_url).with(
        :get_object,
        bucket: 'test-bucket',
        key: 'maps/test/scene.json',
        expires_in: 7200
      ).and_return('https://example.com/signed-url')

      map_file.generate_signed_url(expires_in: 7200)
    end

    it 'uses correct S3 bucket and key' do
      presigner = instance_double(Aws::S3::Presigner)
      allow(Aws::S3::Presigner).to receive(:new).and_return(presigner)

      expect(presigner).to receive(:presigned_url).with(
        :get_object,
        hash_including(
          bucket: 'test-bucket',
          key: 'maps/test/scene.json'
        )
      ).and_return('https://example.com/signed-url')

      map_file.generate_signed_url
    end
  end

  describe '#as_json_for_api' do
    let(:map_file) do
      create(
        :foundry_map_file,
        file_path: 'maps/dungeon/scene.json',
        file_type: 'scene',
        file_size: 5000,
        s3_key: 'foundry/maps/test.json'
      )
    end

    before do
      allow(map_file).to receive(:generate_signed_url).and_return('https://example.com/signed-url')
    end

    it 'returns a hash with expected keys' do
      json = map_file.as_json_for_api

      expect(json).to include(
        :id,
        :file_name,
        :file_path,
        :file_type,
        :file_size,
        :s3_key,
        :signed_url,
        :path,
        :size,
        :type
      )
    end

    it 'includes file_name extracted from path' do
      expect(map_file.as_json_for_api[:file_name]).to eq('scene.json')
    end

    it 'includes backward compatibility fields' do
      json = map_file.as_json_for_api

      expect(json[:path]).to eq(json[:file_path])
      expect(json[:size]).to eq(json[:file_size])
      expect(json[:type]).to eq(json[:file_type])
    end

    it 'defaults file_size to 0 when nil' do
      file = create(:foundry_map_file, file_size: nil)
      allow(file).to receive(:generate_signed_url).and_return('https://example.com/signed-url')

      json = file.as_json_for_api
      expect(json[:file_size]).to eq(0)
      expect(json[:size]).to eq(0)
    end

    it 'includes signed URL' do
      json = map_file.as_json_for_api
      expect(json[:signed_url]).to eq('https://example.com/signed-url')
    end
  end

  describe 'factory' do
    it 'creates a valid file' do
      expect(foundry_map_file).to be_valid
    end

    it 'creates a scene file with trait' do
      scene = create(:foundry_map_file, :scene)
      expect(scene.file_type).to eq('scene')
      expect(scene.content_type).to eq('application/json')
    end

    it 'creates a background file with trait' do
      background = create(:foundry_map_file, :background)
      expect(background.file_type).to eq('background')
      expect(background.content_type).to eq('image/jpeg')
    end

    it 'creates a tile file with trait' do
      tile = create(:foundry_map_file, :tile)
      expect(tile.file_type).to eq('tile')
      expect(tile.content_type).to eq('image/png')
    end

    it 'creates a token file with trait' do
      token = create(:foundry_map_file, :token)
      expect(token.file_type).to eq('token')
      expect(token.content_type).to eq('image/png')
    end

    it 'creates an audio file with trait' do
      audio = create(:foundry_map_file, :audio)
      expect(audio.file_type).to eq('audio')
      expect(audio.content_type).to eq('audio/mpeg')
    end

    it 'creates a thumbnail file with trait' do
      thumbnail = create(:foundry_map_file, :thumbnail)
      expect(thumbnail.file_type).to eq('thumbnail')
      expect(thumbnail.content_type).to eq('image/jpeg')
    end

    it 'generates unique s3_keys' do
      file1 = create(:foundry_map_file)
      file2 = create(:foundry_map_file)
      expect(file1.s3_key).not_to eq(file2.s3_key)
    end
  end
end
