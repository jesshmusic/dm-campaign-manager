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
FactoryBot.define do
  factory :foundry_scene do
    user factory: :dungeon_master_user
    world_id { 'greyhawk' }
    world_title { 'Greyhawk' }
    sequence(:name) { |n| "Map #{n}" }
    sequence(:foundry_uuid) { |n| "Scene.#{n.to_s.rjust(16, 'a')}" }
    version { '1-abc' }
    sequence(:thumbnail_s3_key) { |n| "thumbnails/scenes/1/#{n}.webp" }
    thumbnail_url { "https://test-bucket.s3.us-east-1.amazonaws.com/#{thumbnail_s3_key}" }
  end
end
