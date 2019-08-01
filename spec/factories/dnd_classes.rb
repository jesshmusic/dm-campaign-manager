# == Schema Information
#
# Table name: dnd_classes
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  hit_die    :integer
#  name       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

FactoryBot.define do
  factory :dnd_class do
    name { "MyText" }
    hit_die { 1 }
  end
end
