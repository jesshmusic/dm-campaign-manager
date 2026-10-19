# == Schema Information
#
# Table name: setup_guide_templates
#
#  id          :bigint           not null, primary key
#  description :text             not null
#  example     :text             default(""), not null
#  key         :string           not null
#  position    :integer          not null
#  title       :string           not null
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_setup_guide_templates_on_key  (key) UNIQUE
#
FactoryBot.define do
  factory :setup_guide_template do
    key { 'three_act' }
    position { SetupGuideTemplate::KEYS.index(key) || 0 }
    sequence(:title) { |n| "Template #{n}" }
    description { 'What this template sets up.' }
    example { 'An example campaign.' }
  end
end
