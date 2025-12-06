# == Schema Information
#
# Table name: foundry_map_tags
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_foundry_map_tags_on_name  (name)
#  index_foundry_map_tags_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :foundry_map_tag do
    sequence(:name) { |n| "Tag #{n}" }
    sequence(:slug) { |n| "tag-#{n}" }

    trait :dungeon do
      name { 'Dungeon' }
      slug { 'dungeon' }
    end

    trait :cave do
      name { 'Cave' }
      slug { 'cave' }
    end

    trait :forest do
      name { 'Forest' }
      slug { 'forest' }
    end

    trait :city do
      name { 'City' }
      slug { 'city' }
    end

    trait :tavern do
      name { 'Tavern' }
      slug { 'tavern' }
    end
  end
end
