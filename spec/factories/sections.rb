# == Schema Information
#
# Table name: sections
#
#  id          :bigint           not null, primary key
#  description :string
#  edition     :string           default("2014"), not null
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_sections_on_edition           (edition)
#  index_sections_on_slug_and_edition  (slug,edition) UNIQUE
#
FactoryBot.define do
  factory :section do
    sequence(:name) { |n| "Section #{n}" }
    description { "A section description" }
  end
end
