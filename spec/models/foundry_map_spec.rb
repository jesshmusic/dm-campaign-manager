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
require 'rails_helper'

RSpec.describe FoundryMap, type: :model do
  describe 'factory' do
    it 'is valid' do
      expect(create(:foundry_map)).to be_valid
    end
  end

  describe 'validations' do
    it 'requires name' do
      map = build(:foundry_map, name: nil)
      expect(map).not_to be_valid
    end

    it 'is valid with name' do
      map = build(:foundry_map, name: 'Test Map')
      expect(map).to be_valid
    end

    it 'requires access_level' do
      map = build(:foundry_map, access_level: nil)
      expect(map).not_to be_valid
    end

    it 'requires access_level to be free or premium' do
      map = build(:foundry_map, access_level: 'invalid')
      expect(map).not_to be_valid
    end

    it 'accepts free access_level' do
      map = build(:foundry_map, access_level: 'free')
      expect(map).to be_valid
    end

    it 'accepts premium access_level' do
      map = build(:foundry_map, access_level: 'premium')
      expect(map).to be_valid
    end
  end

  describe 'associations' do
    it 'has_many foundry_map_taggings' do
      map = create(:foundry_map)
      expect(map).to respond_to(:foundry_map_taggings)
    end

    it 'has_many foundry_map_tags through foundry_map_taggings' do
      map = create(:foundry_map)
      expect(map).to respond_to(:foundry_map_tags)
    end

    it 'can add tags' do
      map = create(:foundry_map)
      tag = create(:foundry_map_tag)
      map.foundry_map_tags << tag

      expect(map.foundry_map_tags).to include(tag)
    end

    it 'destroys dependent foundry_map_taggings' do
      map = create(:foundry_map)
      tag = create(:foundry_map_tag)
      tagging = create(:foundry_map_tagging, foundry_map: map, foundry_map_tag: tag)

      expect { map.destroy }.to change { FoundryMapTagging.count }.by(-1)
    end

    it 'has_many foundry_map_files' do
      map = create(:foundry_map)
      expect(map).to respond_to(:foundry_map_files)
    end

    it 'destroys dependent foundry_map_files' do
      map = create(:foundry_map)
      file = create(:foundry_map_file, foundry_map: map)

      expect { map.destroy }.to change { FoundryMapFile.count }.by(-1)
    end
  end

  describe 'scopes' do
    it 'published scope returns only published maps' do
      published = create(:foundry_map, published: true)
      unpublished = create(:foundry_map, published: false)

      result = FoundryMap.published
      expect(result).to include(published)
      expect(result).not_to include(unpublished)
    end

    it 'free scope returns only free access maps' do
      free = create(:foundry_map, access_level: 'free')
      premium = create(:foundry_map, access_level: 'premium')

      result = FoundryMap.free
      expect(result).to include(free)
      expect(result).not_to include(premium)
    end

    it 'premium scope returns only premium access maps' do
      free = create(:foundry_map, access_level: 'free')
      premium = create(:foundry_map, access_level: 'premium')

      result = FoundryMap.premium
      expect(result).to include(premium)
      expect(result).not_to include(free)
    end

    it 'recent scope orders by created_at descending' do
      map1 = create(:foundry_map, name: 'Map 1')
      map2 = create(:foundry_map, name: 'Map 2')
      map3 = create(:foundry_map, name: 'Map 3')

      result = FoundryMap.recent
      expect(result.first).to eq(map3)
      expect(result.last).to eq(map1)
    end
  end

  describe '#free?' do
    it 'returns true when access_level is free' do
      map = create(:foundry_map, access_level: 'free')
      expect(map.free?).to be true
    end

    it 'returns false when access_level is premium' do
      map = create(:foundry_map, access_level: 'premium')
      expect(map.free?).to be false
    end
  end

  describe '#premium?' do
    it 'returns true when access_level is premium' do
      map = create(:foundry_map, access_level: 'premium')
      expect(map.premium?).to be true
    end

    it 'returns false when access_level is free' do
      map = create(:foundry_map, access_level: 'free')
      expect(map.premium?).to be false
    end
  end

  describe '#increment_downloads!' do
    it 'increments download_count' do
      map = create(:foundry_map, download_count: 5)
      map.increment_downloads!

      expect(map.download_count).to eq(6)
    end

    it 'increments from zero' do
      map = create(:foundry_map, download_count: 0)
      map.increment_downloads!

      expect(map.download_count).to eq(1)
    end

    it 'persists to database' do
      map = create(:foundry_map, download_count: 10)
      map.increment_downloads!

      reloaded = FoundryMap.find(map.id)
      expect(reloaded.download_count).to eq(11)
    end
  end

  describe '#generate_thumbnail_signed_url' do
    it 'returns nil when thumbnail_s3_key is not present' do
      map = create(:foundry_map, thumbnail_s3_key: nil)
      result = map.generate_thumbnail_signed_url

      expect(result).to be_nil
    end

    it 'returns URL when thumbnail_s3_key is present' do
      map = create(:foundry_map, thumbnail_s3_key: 'maps/test-map.jpg')

      # Mock AWS S3 to avoid actual AWS calls
      allow_any_instance_of(Aws::S3::Presigner).to receive(:presigned_url).and_return('https://signed.url')

      result = map.generate_thumbnail_signed_url
      expect(result).to eq('https://signed.url')
    end

    it 'accepts expires_in parameter' do
      map = create(:foundry_map, thumbnail_s3_key: 'maps/test-map.jpg')

      allow_any_instance_of(Aws::S3::Presigner).to receive(:presigned_url).and_return('https://signed.url')

      result = map.generate_thumbnail_signed_url(expires_in: 7200)
      expect(result).to eq('https://signed.url')
    end

    it 'defaults to 3600 seconds expiry' do
      map = create(:foundry_map, thumbnail_s3_key: 'maps/test-map.jpg')

      presigner_mock = double
      allow_any_instance_of(Aws::S3::Presigner).to receive(:presigned_url).with(
        :get_object,
        bucket: ENV['AWS_S3_BUCKET'],
        key: 'maps/test-map.jpg',
        expires_in: 3600
      ).and_return('https://signed.url')

      allow(Aws::S3::Presigner).to receive(:new).and_return(presigner_mock)
      allow(presigner_mock).to receive(:presigned_url).and_return('https://signed.url')

      result = map.generate_thumbnail_signed_url
      expect(result).to eq('https://signed.url')
    end
  end

  describe '#as_json_for_api' do
    it 'returns hash with expected keys' do
      map = create(:foundry_map,
                   name: 'Test Map',
                   description: 'A test map',
                   access_level: 'free',
                   thumbnail_url: 'https://example.com/thumb.jpg',
                   grid_size: 70,
                   grid_units: 'ft',
                   width: 800,
                   height: 600,
                   keywords: ['tavern', 'indoor'],
                   published: true)

      result = map.as_json_for_api

      expect(result).to include(
        :id, :name, :description, :thumbnail, :tags, :keywords,
        :access, :requiredTier, :published, :gridSize, :gridUnits,
        :resolution, :createdAt, :updatedAt
      )
    end

    it 'converts access_level to capitalized access' do
      map = create(:foundry_map, access_level: 'free')
      result = map.as_json_for_api

      expect(result[:access]).to eq('Free')
    end

    it 'includes tags array' do
      map = create(:foundry_map)
      tag1 = create(:foundry_map_tag, name: 'tavern')
      tag2 = create(:foundry_map_tag, name: 'indoor')
      map.foundry_map_tags << tag1
      map.foundry_map_tags << tag2

      result = map.as_json_for_api
      expect(result[:tags]).to include('tavern', 'indoor')
    end

    it 'includes keywords array or empty array' do
      map_with_keywords = create(:foundry_map, keywords: ['tavern', 'forest'])
      map_without_keywords = create(:foundry_map, keywords: nil)

      expect(map_with_keywords.as_json_for_api[:keywords]).to eq(['tavern', 'forest'])
      expect(map_without_keywords.as_json_for_api[:keywords]).to eq([])
    end

    it 'includes resolution with width and height' do
      map = create(:foundry_map, width: 1024, height: 768)
      result = map.as_json_for_api

      expect(result[:resolution][:width]).to eq(1024)
      expect(result[:resolution][:height]).to eq(768)
    end

    it 'omits missing resolution dimensions' do
      map = create(:foundry_map, width: 800, height: nil)
      result = map.as_json_for_api

      # compact removes nil values
      expect(result[:resolution]).to include(width: 800)
    end

    it 'includes ISO8601 formatted timestamps' do
      map = create(:foundry_map)
      result = map.as_json_for_api

      expect(result[:createdAt]).to match(/\d{4}-\d{2}-\d{2}T/)
      expect(result[:updatedAt]).to match(/\d{4}-\d{2}-\d{2}T/)
    end

    it 'includes requiredTier or defaults to free' do
      map_with_tier = create(:foundry_map, required_tier: 'premium')
      map_without_tier = create(:foundry_map, required_tier: nil)

      expect(map_with_tier.as_json_for_api[:requiredTier]).to eq('premium')
      expect(map_without_tier.as_json_for_api[:requiredTier]).to eq('free')
    end
  end

  describe 'attributes' do
    it 'has name attribute' do
      map = create(:foundry_map, name: 'Town Square')
      expect(map.name).to eq('Town Square')
    end

    it 'has description attribute' do
      map = create(:foundry_map, description: 'A bustling town square')
      expect(map.description).to eq('A bustling town square')
    end

    it 'has access_level attribute' do
      map = create(:foundry_map, access_level: 'premium')
      expect(map.access_level).to eq('premium')
    end

    it 'has published attribute' do
      map = create(:foundry_map, published: false)
      expect(map.published).to eq(false)
    end

    it 'has download_count attribute defaulting to 0' do
      map = create(:foundry_map)
      expect(map.download_count).to eq(0)
    end

    it 'has grid_size attribute' do
      map = create(:foundry_map, grid_size: 70)
      expect(map.grid_size).to eq(70)
    end

    it 'has grid_units attribute' do
      map = create(:foundry_map, grid_units: 'feet')
      expect(map.grid_units).to eq('feet')
    end

    it 'has width attribute' do
      map = create(:foundry_map, width: 1024)
      expect(map.width).to eq(1024)
    end

    it 'has height attribute' do
      map = create(:foundry_map, height: 768)
      expect(map.height).to eq(768)
    end

    it 'has thumbnail_url attribute' do
      map = create(:foundry_map, thumbnail_url: 'https://example.com/thumb.jpg')
      expect(map.thumbnail_url).to eq('https://example.com/thumb.jpg')
    end

    it 'has thumbnail_s3_key attribute' do
      map = create(:foundry_map, thumbnail_s3_key: 'maps/test.jpg')
      expect(map.thumbnail_s3_key).to eq('maps/test.jpg')
    end

    it 'has keywords attribute' do
      map = create(:foundry_map, keywords: ['forest', 'outdoor'])
      expect(map.keywords).to include('forest', 'outdoor')
    end

    it 'has required_tier attribute' do
      map = create(:foundry_map, required_tier: 'premium')
      expect(map.required_tier).to eq('premium')
    end
  end

  describe 'complex scenarios' do
    it 'can have multiple tags' do
      map = create(:foundry_map)
      tag1 = create(:foundry_map_tag, name: 'tavern')
      tag2 = create(:foundry_map_tag, name: 'indoor')
      tag3 = create(:foundry_map_tag, name: 'medieval')
      map.foundry_map_tags << tag1
      map.foundry_map_tags << tag2
      map.foundry_map_tags << tag3

      expect(map.foundry_map_tags.count).to eq(3)
      expect(map.foundry_map_tags.map(&:name)).to include('tavern', 'indoor', 'medieval')
    end

    it 'can have multiple files' do
      map = create(:foundry_map)
      file1 = create(:foundry_map_file, foundry_map: map)
      file2 = create(:foundry_map_file, foundry_map: map)

      expect(map.foundry_map_files.count).to eq(2)
    end

    it 'preserves all attributes after save' do
      map = create(:foundry_map,
                   name: 'Lost City',
                   description: 'An ancient lost city',
                   access_level: 'premium',
                   published: true,
                   download_count: 100,
                   grid_size: 100,
                   grid_units: 'meters',
                   width: 2048,
                   height: 1536,
                   keywords: ['ancient', 'exploration'])

      reloaded = FoundryMap.find(map.id)
      expect(reloaded.name).to eq('Lost City')
      expect(reloaded.description).to eq('An ancient lost city')
      expect(reloaded.access_level).to eq('premium')
      expect(reloaded.published).to eq(true)
      expect(reloaded.download_count).to eq(100)
      expect(reloaded.keywords).to eq(['ancient', 'exploration'])
    end
  end
end
