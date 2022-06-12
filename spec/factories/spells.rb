# == Schema Information
#
# Table name: spells
#
#  widgetId            :bigint           not null, primary key
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
#  fk_rails_...  (user_id => users.widgetId)
#

FactoryBot.define do
  factory :spell do
    name { Faker::Games::ElderScrolls.dragon }
    description { Faker::Games::Witcher.quote }
    range { "60 feet" }
    components { [%w(V S M), %w(V S), %w(V), %w(S), %w(M), %w(V M), %w(S M)].sample }
    material { Faker::Games::Zelda.item }
    ritual { [false, true].sample }
    duration { ['1 Round', '1 minute', '10 minutes', '1 hour'].sample }
    concentration { [false, true].sample }
    casting_time { ['Instant', 'Reaction', '1 Round'].sample }
    school { %w(Evocation Conjuration Necromancy Illusion).sample }
    level { Faker::Number.between(from: 1, to: 9) }
  end
end
