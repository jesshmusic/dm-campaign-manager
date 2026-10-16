FactoryBot.define do
  factory :player_character do
    user factory: :dungeon_master_user
    world_id { 'greyhawk' }
    world_title { 'Greyhawk' }
    sequence(:name) { |n| "Hero #{n}" }
    sequence(:foundry_uuid) { |n| "Actor.#{n.to_s.rjust(16, 'a')}" }
    player_name { 'Sam' }
    level { 3 }
    sheet do
      { 'summary' => 'Level 3 Dragonborn Cleric', 'ac' => 18,
        'classes' => [{ 'name' => 'Cleric', 'subclass' => 'Life Domain', 'levels' => 3 }] }
    end
  end
end
