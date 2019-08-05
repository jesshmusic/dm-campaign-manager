# == Schema Information
#
# Table name: dnd_classes
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  hit_die    :integer
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#
# Indexes
#
#  index_dnd_classes_on_slug     (slug) UNIQUE
#  index_dnd_classes_on_user_id  (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#

FactoryBot.define do
  factory :dnd_class do
    name { "MyText" }
    hit_die { 1 }
  end
end
