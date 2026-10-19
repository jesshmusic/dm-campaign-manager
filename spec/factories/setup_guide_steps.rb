# == Schema Information
#
# Table name: setup_guide_steps
#
#  id         :bigint           not null, primary key
#  example    :text
#  intro      :text             not null
#  key        :string           not null
#  label      :string           not null
#  position   :integer          not null
#  title      :string           not null
#  why        :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_setup_guide_steps_on_key  (key) UNIQUE
#
FactoryBot.define do
  factory :setup_guide_step do
    key { 'kind' }
    position { SetupGuideStep::KEYS.index(key) || 0 }
    label { key.to_s.humanize }
    sequence(:title) { |n| "Step #{n}" }
    intro { 'What this step asks for.' }
    why { 'Why it matters.' }
    example { 'An example.' }
  end
end
