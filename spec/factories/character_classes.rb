# == Schema Information
#
# Table name: character_classes
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  character_id :bigint
#  dnd_class_id :bigint
#
# Indexes
#
#  index_character_classes_on_character_id  (character_id)
#  index_character_classes_on_dnd_class_id  (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (character_id => characters.id)
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#

FactoryBot.define do
  factory :character_class do
    character { nil }
    dnd_class { nil }
  end
end
