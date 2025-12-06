# == Schema Information
#
# Table name: foundry_map_taggings
#
#  id                 :bigint           not null, primary key
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  foundry_map_id     :bigint           not null
#  foundry_map_tag_id :bigint           not null
#
# Indexes
#
#  index_foundry_map_taggings_on_foundry_map_id      (foundry_map_id)
#  index_foundry_map_taggings_on_foundry_map_tag_id  (foundry_map_tag_id)
#  index_map_taggings_on_map_and_tag                 (foundry_map_id,foundry_map_tag_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (foundry_map_id => foundry_maps.id)
#  fk_rails_...  (foundry_map_tag_id => foundry_map_tags.id)
#
FactoryBot.define do
  factory :foundry_map_tagging do
    association :foundry_map
    association :foundry_map_tag
  end
end
