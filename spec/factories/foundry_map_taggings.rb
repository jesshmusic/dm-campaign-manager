FactoryBot.define do
  factory :foundry_map_tagging do
    association :foundry_map
    association :foundry_map_tag
  end
end
