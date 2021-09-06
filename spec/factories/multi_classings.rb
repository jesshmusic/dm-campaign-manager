# == Schema Information
#
# Table name: multi_classings
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  dnd_class_id :bigint           not null
#
# Indexes
#
#  index_multi_classings_on_dnd_class_id  (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#
FactoryBot.define do
  factory :multi_classing do
    dnd_class { nil }
  end
end
