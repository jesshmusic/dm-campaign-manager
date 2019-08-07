# == Schema Information
#
# Table name: spells
#
#  id            :bigint           not null, primary key
#  api_url       :string
#  casting_time  :string
#  components    :text             default([]), is an Array
#  concentration :boolean
#  description   :text
#  duration      :string
#  higher_level  :text
#  level         :integer
#  material      :string
#  name          :string
#  page          :string
#  range         :string
#  ritual        :boolean
#  school        :string
#  slug          :string
#  spell_level   :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint
#
# Indexes
#
#  index_spells_on_slug     (slug) UNIQUE
#  index_spells_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

FactoryBot.define do
  factory :spell do
    name { "MyText" }
    description { "MyText" }
    higher_level { "MyText" }
    page { "MyText" }
    range { "MyText" }
    components { "MyText" }
    material { "MyText" }
    ritual { false }
    duration { "MyText" }
    concentration { false }
    casting_time { "MyString" }
    level { 1 }
  end
end
