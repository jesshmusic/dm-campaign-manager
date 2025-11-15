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

require 'rails_helper'

RSpec.describe FoundryMap, type: :model do
  let(:foundry_map) { create(:foundry_map) }

  describe 'associations' do
    it { should have_many(:foundry_map_taggings).dependent(:destroy) }
    it { should have_many(:foundry_map_tags).through(:foundry_map_taggings) }
    it { should have_many(:foundry_map_files).dependent(:destroy) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:access_level) }
    it { should validate_inclusion_of(:access_level).in_array(%w[free premium]) }
  end

  describe 'scopes' do
    let!(:published_map) { create(:foundry_map, published: true) }
    let!(:unpublished_map) { create(:foundry_map, :unpublished) }
    let!(:free_map) { create(:foundry_map, access_level: 'free') }
    let!(:premium_map) { create(:foundry_map, :premium) }

    let(:new_map) do
      travel_to(1.hour.ago) { create(:foundry_map) }
    end

    let(:old_map) do
      travel_to(2.days.ago) { create(:foundry_map) }
    end

    describe '.published' do
      it 'returns only published maps' do
        expect(FoundryMap.published).to include(published_map)
        expect(FoundryMap.published).not_to include(unpublished_map)
      end
    end

    describe '.free' do
      it 'returns only free maps' do
        expect(FoundryMap.free).to include(free_map)
        expect(FoundryMap.free).not_to include(premium_map)
      end
    end

    describe '.premium' do
      it 'returns only premium maps' do
        expect(FoundryMap.premium).to include(premium_map)
        expect(FoundryMap.premium).not_to include(free_map)
      end
    end

    describe '.recent' do
      it 'returns maps ordered by created_at descending' do
        # Force evaluation of let variables
        old_map
        new_map

        recent_maps = FoundryMap.recent.to_a
        old_map_index = recent_maps.index { |m| m.id == old_map.id }
        new_map_index = recent_maps.index { |m| m.id == new_map.id }

        expect(old_map_index).not_to be_nil
        expect(new_map_index).not_to be_nil
        expect(new_map_index).to be < old_map_index
      end
    end
  end

  describe '#free?' do
    context 'when access_level is free' do
      let(:free_map) { create(:foundry_map, access_level: 'free') }

      it 'returns true' do
        expect(free_map.free?).to be true
      end
    end

    context 'when access_level is premium' do
      let(:premium_map) { create(:foundry_map, :premium) }

      it 'returns false' do
        expect(premium_map.free?).to be false
      end
    end
  end

  describe '#premium?' do
    context 'when access_level is premium' do
      let(:premium_map) { create(:foundry_map, :premium) }

      it 'returns true' do
        expect(premium_map.premium?).to be true
      end
    end

    context 'when access_level is free' do
      let(:free_map) { create(:foundry_map, access_level: 'free') }

      it 'returns false' do
        expect(free_map.premium?).to be false
      end
    end
  end

  describe '#increment_downloads!' do
    it 'increments the download_count by 1' do
      expect {
        foundry_map.increment_downloads!
      }.to change { foundry_map.reload.download_count }.by(1)
    end
  end

  describe '#generate_thumbnail_signed_url' do
    let(:map_with_thumbnail) { create(:foundry_map, thumbnail_s3_key: 'thumbnails/test.jpg') }
    let(:map_without_thumbnail) { create(:foundry_map, thumbnail_s3_key: nil) }

    before do
      allow(ENV).to receive(:[]).and_call_original
      allow(ENV).to receive(:[]).with('AWS_REGION').and_return('us-east-1')
      allow(ENV).to receive(:[]).with('AWS_ACCESS_KEY_ID').and_return('test_access_key')
      allow(ENV).to receive(:[]).with('AWS_SECRET_ACCESS_KEY').and_return('test_secret_key')
      allow(ENV).to receive(:[]).with('AWS_S3_BUCKET').and_return('test-bucket')
    end

    context 'when thumbnail_s3_key is present' do
      it 'generates a signed URL' do
        allow_any_instance_of(Aws::S3::Presigner).to receive(:presigned_url).and_return('https://example.com/signed-url')

        url = map_with_thumbnail.generate_thumbnail_signed_url
        expect(url).to eq('https://example.com/signed-url')
      end

      it 'accepts custom expiry time' do
        presigner = instance_double(Aws::S3::Presigner)
        allow(Aws::S3::Presigner).to receive(:new).and_return(presigner)
        expect(presigner).to receive(:presigned_url).with(
          :get_object,
          bucket: 'test-bucket',
          key: 'thumbnails/test.jpg',
          expires_in: 7200
        ).and_return('https://example.com/signed-url')

        map_with_thumbnail.generate_thumbnail_signed_url(expires_in: 7200)
      end
    end

    context 'when thumbnail_s3_key is not present' do
      it 'returns nil' do
        expect(map_without_thumbnail.generate_thumbnail_signed_url).to be_nil
      end
    end
  end

  describe '#as_json_for_api' do
    let(:map) { create(:foundry_map, :with_tags) }

    it 'returns a hash with expected keys' do
      json = map.as_json_for_api

      expect(json).to include(
        :id,
        :name,
        :description,
        :thumbnail,
        :tags,
        :keywords,
        :access,
        :requiredTier,
        :published,
        :gridSize,
        :gridUnits,
        :resolution,
        :createdAt,
        :updatedAt
      )
    end

    it 'capitalizes access level' do
      free_map = create(:foundry_map, access_level: 'free')
      expect(free_map.as_json_for_api[:access]).to eq('Free')

      premium_map = create(:foundry_map, :premium)
      expect(premium_map.as_json_for_api[:access]).to eq('Premium')
    end

    it 'includes tag names' do
      expect(map.as_json_for_api[:tags]).to be_an(Array)
      expect(map.as_json_for_api[:tags].length).to eq(3)
    end

    it 'includes resolution with width and height' do
      map = create(:foundry_map, width: 4000, height: 3000)
      resolution = map.as_json_for_api[:resolution]

      expect(resolution).to eq({ width: 4000, height: 3000 })
    end

    it 'formats timestamps as ISO8601' do
      json = map.as_json_for_api

      expect(json[:createdAt]).to match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      expect(json[:updatedAt]).to match(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
    end
  end

  describe 'factory' do
    it 'creates a valid map' do
      expect(foundry_map).to be_valid
    end

    it 'creates a premium map with trait' do
      premium_map = create(:foundry_map, :premium)
      expect(premium_map.access_level).to eq('premium')
      expect(premium_map.required_tier).to eq('wizard')
    end

    it 'creates an unpublished map with trait' do
      unpublished_map = create(:foundry_map, :unpublished)
      expect(unpublished_map.published).to be false
    end

    it 'creates a map with tags using trait' do
      map_with_tags = create(:foundry_map, :with_tags)
      expect(map_with_tags.foundry_map_tags.count).to eq(3)
    end

    it 'creates a map with files using trait' do
      map_with_files = create(:foundry_map, :with_files)
      expect(map_with_files.foundry_map_files.count).to eq(3)
      expect(map_with_files.foundry_map_files.pluck(:file_type)).to include('scene', 'background', 'thumbnail')
    end
  end
end
