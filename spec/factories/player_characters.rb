# == Schema Information
#
# Table name: player_characters
#
#  id           :bigint           not null, primary key
#  foundry_uuid :string           not null
#  level        :integer
#  name         :string           not null
#  player_name  :string
#  sheet        :jsonb            not null
#  world_title  :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint           not null
#  world_id     :string           not null
#
# Indexes
#
#  idx_on_user_id_world_id_foundry_uuid_9ad0edfc57  (user_id,world_id,foundry_uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
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
