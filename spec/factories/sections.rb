# == Schema Information
#
# Table name: sections
#
#  id          :bigint           not null, primary key
#  description :string
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_sections_on_slug  (slug) UNIQUE
#
FactoryBot.define do
  factory :section do
    sequence(:name) { |n| "Section #{n}" }
    description { "A section description" }
  end
end
