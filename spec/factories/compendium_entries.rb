FactoryBot.define do
  factory :compendium_entry do
    user factory: :dungeon_master_user
    pack { 'dnd-monster-manual.actors' }
    pack_version { 'dnd-monster-manual@1.0.0+1' }
    sequence(:name) { |n| "Monster #{n}" }
    category { 'monster' }
    challenge_rating { '1' }
    detail { 'Undead' }
    foundry_uuid { "Compendium.#{pack}.Actor.#{SecureRandom.alphanumeric(16)}" }
  end
end
