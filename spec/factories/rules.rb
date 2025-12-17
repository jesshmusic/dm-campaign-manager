# == Schema Information
#
# Table name: rules
#
#  id          :bigint           not null, primary key
#  category    :string
#  description :string
#  edition     :string           default("2014"), not null
#  name        :string
#  slug        :string
#  subcategory :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  parent_id   :bigint
#
# Indexes
#
#  index_rules_on_edition           (edition)
#  index_rules_on_parent_id         (parent_id)
#  index_rules_on_slug_and_edition  (slug,edition) UNIQUE
#
FactoryBot.define do
  factory :rule do
    sequence(:name) { |n| "Rule #{n}" }
    description { "A rule description" }
    category { "General" }
    subcategory { "Basic" }
  end
end
