# == Schema Information
#
# Table name: dnd_classes
#
#  id            :bigint           not null, primary key
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
#  fk_rails_...  (user_id => users.id)
#

FactoryBot.define do
  factory :dnd_class do
    name { Faker::Games::ElderScrolls.race }
    hit_die { [6, 6, 8, 8, 8, 8, 10, 10, 10, 12].sample }
    spell_ability { DndRules.abilities.sample }
    primary_abilities { [DndRules.abilities.sample, DndRules.abilities.sample] }
    saving_throw_abilities { [DndRules.abilities.sample, DndRules.abilities.sample] }

    factory :dnd_class_fighter do
      name { 'Fighter' }
      hit_die { 10 }
      spell_ability { nil }
      primary_abilities { %w(Strength Dexterity) }
      saving_throw_abilities { %w(Strength Constitution) }
    end

    factory :dnd_class_barbarian do
      name { 'Barbarian' }
      hit_die { 12 }
      spell_ability { nil }
      primary_abilities { %w(Strength) }
      saving_throw_abilities { %w(Strength Constitution) }
    end

    factory :dnd_class_bard do
      name { 'Bard' }
      hit_die { 8 }
      spell_ability { nil }
      primary_abilities { %w(Charisma) }
      saving_throw_abilities { %w(Dexterity Charisma) }
    end

    factory :dnd_class_cleric do
      name { 'Cleric' }
      hit_die { 8 }
      spell_ability { 'Wisdom' }
      primary_abilities { %w(Wisdom) }
      saving_throw_abilities { %w(Wisdom Charisma) }
    end

    factory :dnd_class_wizard do
      name { 'Wizard' }
      hit_die { 6 }
      spell_ability { 'Intelligence' }
      primary_abilities { %w(Intelligence) }
      saving_throw_abilities { %w(Intelligence Wisdom) }
    end
  end
end
