FactoryBot.define do
  factory :class_specific_creating_spell_slot do
    sorcery_point_cost { 1 }
    spell_slot_level { 1 }
    class_specific { nil }
  end
end
