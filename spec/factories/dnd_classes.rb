# == Schema Information
#
# Table name: dnd_classes
#
#  widgetId            :bigint           not null, primary key
#  api_url       :string
#  hit_die       :integer
#  name          :string
#  slug          :string
#  spell_ability :string
#  subclasses    :string           default([]), is an Array
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint
#
# Indexes
#
#  index_dnd_classes_on_slug     (slug) UNIQUE
#  index_dnd_classes_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.widgetId)
#

FactoryBot.define do
  factory :dnd_class do
    hit_die { [6, 6, 8, 8, 8, 8, 10, 10, 10, 12].sample }
    name { 'Fighter' }
    spell_ability { DndRules.abilities.sample }
    slug { 'fighter' }
    subclasses { [] }
    ability_scores {[
      association(:str_ability_score),
      association(:dex_ability_score),
      association(:con_ability_score),
      association(:int_ability_score),
      association(:wis_ability_score),
      association(:cha_ability_score)
    ]}
    after(:create) do |dnd_class|
      create(:multi_classing, dnd_class: dnd_class)
    end
  end
end
