# == Schema Information
#
# Table name: class_specifics
#
#  widgetId                 :bigint           not null, primary key
#  index              :string
#  name               :string
#  value              :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  dnd_class_level_id :bigint           not null
#
# Indexes
#
#  index_class_specifics_on_dnd_class_level_id  (dnd_class_level_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_level_id => dnd_class_levels.widgetId)
#
FactoryBot.define do
  factory :class_specific do
    dnd_class_level { nil }
  end
end
