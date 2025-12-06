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
FactoryBot.define do
  factory :foundry_map do
    sequence(:name) { |n| "Dungeon Map #{n}" }
    description { "A detailed map for your adventure" }
    access_level { 'free' }
    required_tier { 'free' }
    published { true }
    grid_size { 100 }
    grid_units { 'px' }
    width { 4000 }
    height { 3000 }
    thumbnail_url { "https://example.com/thumbnails/map-#{SecureRandom.hex(8)}.jpg" }
    thumbnail_s3_key { "thumbnails/#{SecureRandom.hex(16)}.jpg" }
    keywords { ['dungeon', 'cave', 'underground'] }
    download_count { 0 }

    trait :premium do
      access_level { 'premium' }
      required_tier { 'wizard' }
    end

    trait :unpublished do
      published { false }
    end

    trait :with_tags do
      after(:create) do |map|
        create_list(:foundry_map_tag, 3, foundry_maps: [map])
      end
    end

    trait :with_files do
      after(:create) do |map|
        create(:foundry_map_file, :scene, foundry_map: map)
        create(:foundry_map_file, :background, foundry_map: map)
        create(:foundry_map_file, :thumbnail, foundry_map: map)
      end
    end
  end
end
