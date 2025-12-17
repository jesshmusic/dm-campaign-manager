# == Schema Information
#
# Table name: profs
#
#  id         :bigint           not null, primary key
#  edition    :string           default("2014"), not null
#  name       :string
#  prof_type  :string
#  slug       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_profs_on_edition           (edition)
#  index_profs_on_name              (name) UNIQUE
#  index_profs_on_slug_and_edition  (slug,edition) UNIQUE
#

FactoryBot.define do
  factory :prof do
    name { "MyString" }
    prof_type { "MyString" }
  end
end
