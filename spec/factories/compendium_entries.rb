# == Schema Information
#
# Table name: compendium_entries
#
#  id               :bigint           not null, primary key
#  category         :string           not null
#  challenge_rating :string
#  detail           :string
#  foundry_uuid     :string           not null
#  homebrew         :boolean          default(FALSE), not null
#  name             :string           not null
#  pack             :string           not null
#  pack_label       :string
#  pack_version     :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  user_id          :bigint           not null
#
# Indexes
#
#  index_compendium_entries_on_user_id_and_category_and_name  (user_id,category,name)
#  index_compendium_entries_on_user_id_and_foundry_uuid       (user_id,foundry_uuid) UNIQUE
#  index_compendium_entries_on_user_id_and_pack               (user_id,pack)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
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

    # From one of the DM's own compendiums
    trait :homebrew do
      pack { 'world.my-monsters' }
      pack_label { 'My Monsters' }
      homebrew { true }
    end
  end
end
