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
