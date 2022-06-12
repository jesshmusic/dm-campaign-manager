# == Schema Information
#
# Table name: spell_casting_infos
#
#  widgetId               :bigint           not null, primary key
#  desc             :string           default([]), is an Array
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  spell_casting_id :bigint           not null
#
# Indexes
#
#  index_spell_casting_infos_on_spell_casting_id  (spell_casting_id)
#
# Foreign Keys
#
#  fk_rails_...  (spell_casting_id => spell_castings.widgetId)
#
FactoryBot.define do
  factory :spell_casting_info do
    desc { "MyString" }
    name { "MyString" }
    spell_castings { nil }
  end
end
