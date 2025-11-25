FactoryBot.define do
  factory :foundry_map_file do
    association :foundry_map
    sequence(:file_path) { |n| "maps/dungeon_#{n}/scene.json" }
    sequence(:s3_key) { |n| "foundry-maps/#{SecureRandom.hex(16)}/scene_#{n}.json" }
    file_type { 'scene' }
    content_type { 'application/json' }
    file_size { rand(1000..10000) }

    trait :scene do
      file_type { 'scene' }
      file_path { "maps/#{SecureRandom.hex(8)}/scene.json" }
      content_type { 'application/json' }
    end

    trait :background do
      file_type { 'background' }
      file_path { "maps/#{SecureRandom.hex(8)}/background.jpg" }
      content_type { 'image/jpeg' }
      file_size { rand(100000..500000) }
    end

    trait :tile do
      file_type { 'tile' }
      file_path { "maps/#{SecureRandom.hex(8)}/tile.png" }
      content_type { 'image/png' }
      file_size { rand(50000..200000) }
    end

    trait :token do
      file_type { 'token' }
      file_path { "maps/#{SecureRandom.hex(8)}/token.png" }
      content_type { 'image/png' }
      file_size { rand(10000..50000) }
    end

    trait :audio do
      file_type { 'audio' }
      file_path { "maps/#{SecureRandom.hex(8)}/ambient.mp3" }
      content_type { 'audio/mpeg' }
      file_size { rand(500000..2000000) }
    end

    trait :thumbnail do
      file_type { 'thumbnail' }
      file_path { "maps/#{SecureRandom.hex(8)}/thumb.jpg" }
      content_type { 'image/jpeg' }
      file_size { rand(20000..80000) }
    end
  end
end
