# frozen_string_literal: true

# == Schema Information
#
# Table name: feats
#
#  id           :bigint           not null, primary key
#  category     :string           not null
#  description  :text             not null
#  edition      :string           default("2024"), not null
#  homebrew     :boolean          default(FALSE), not null
#  name         :string           not null
#  prerequisite :string
#  repeatable   :boolean          default(FALSE), not null
#  slug         :string           not null
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  user_id      :bigint
#
# Indexes
#
#  index_feats_on_category          (category)
#  index_feats_on_edition           (edition)
#  index_feats_on_homebrew          (homebrew)
#  index_feats_on_slug_and_edition  (slug,edition) UNIQUE
#  index_feats_on_user_id           (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :feat do
    sequence(:name) { |n| "Feat #{n}" }
    edition { '2024' }
    category { 'General' }
    prerequisite { nil }
    description { 'A sample feat description' }
    repeatable { false }
    homebrew { false }
    user { nil }

    trait :homebrew do
      homebrew { true }
      association :user
    end

    trait :origin do
      category { 'Origin' }
    end

    trait :fighting_style do
      category { 'Fighting Style' }
    end

    trait :epic_boon do
      category { 'Epic Boon' }
      prerequisite { 'Level 19+' }
    end

    trait :alert do
      name { 'Alert' }
      category { 'Origin' }
      description do
        "Always on the lookout for danger, you gain the following benefits:\n\n" \
          "**Initiative Proficiency.** When you roll Initiative, you can add your Proficiency Bonus to the roll.\n\n" \
          "**Initiative Swap.** Immediately after you roll Initiative, you can swap your Initiative with one willing ally."
      end
    end

    trait :magic_initiate do
      name { 'Magic Initiate' }
      category { 'Origin' }
      prerequisite { nil }
      repeatable { true }
      description do
        "You learn two cantrips and one 1st-level spell from a spell list of your choice.\n\n" \
          "**Repeatable.** You can take this feat more than once, choosing a different spell list each time."
      end
    end

    trait :grappler do
      name { 'Grappler' }
      category { 'General' }
      prerequisite { 'Strength or Dexterity 13+' }
      description do
        "You're an accomplished wrestler, granting you the following benefits:\n\n" \
          "**Ability Score Increase.** Increase your Strength or Dexterity score by 1, to a maximum of 20.\n\n" \
          "**Punch and Grab.** When you hit with an Unarmed Strike, you can deal damage and grapple the target.\n\n" \
          "**Attack Advantage.** You have Advantage on attack rolls against a creature Grappled by you."
      end
    end
  end
end
