# == Schema Information
#
# Table name: campaigns
#
#  id                        :bigint           not null, primary key
#  cadence                   :string
#  edition                   :string           default("2024"), not null
#  excluded_compendium_packs :jsonb            not null
#  mode                      :string           default("arc"), not null
#  name                      :string           not null
#  party_size                :integer
#  pitch                     :text
#  planned_sessions          :integer
#  premise                   :text
#  setting_name              :string
#  setting_notes             :text
#  slug                      :string           not null
#  start_level               :integer
#  status                    :string           default("planning"), not null
#  sync_counter              :bigint           default(0), not null
#  sync_version              :bigint           default(0), not null
#  target_level              :integer
#  tone                      :string
#  truths                    :jsonb            not null
#  uuid                      :uuid             not null
#  created_at                :datetime         not null
#  updated_at                :datetime         not null
#  user_id                   :bigint           not null
#
# Indexes
#
#  index_campaigns_on_user_id           (user_id)
#  index_campaigns_on_user_id_and_slug  (user_id,slug) UNIQUE
#  index_campaigns_on_uuid              (uuid) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :campaign do
    association :user, factory: :dungeon_master_user
    sequence(:name) { |n| "Campaign #{n}" }
  end

  factory :campaign_faction do
    campaign
    sequence(:name) { |n| "Faction #{n}" }
  end

  factory :campaign_location do
    campaign
    sequence(:name) { |n| "Location #{n}" }
  end

  factory :campaign_npc do
    campaign
    sequence(:name) { |n| "NPC #{n}" }
    role { 'neutral' }
  end

  factory :campaign_front do
    campaign
    sequence(:name) { |n| "Front #{n}" }
    clock_segments { 6 }
  end

  factory :campaign_quest do
    campaign
    sequence(:name) { |n| "Quest #{n}" }
  end

  factory :campaign_secret do
    campaign
    sequence(:text) { |n| "Secret #{n}" }
  end

  factory :campaign_session do
    campaign
  end

  factory :campaign_reference do
    campaign
    sequence(:name) { |n| "Book Monster #{n}" }
    book { 'mm' }
    category { 'monster' }
    page { 42 }
  end

  factory :campaign_session_link do
    association :session, factory: :campaign_session
    linkable { association :campaign_npc, campaign: session.campaign }
  end
end
