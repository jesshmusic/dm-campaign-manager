# == Schema Information
#
# Table name: martial_arts
#
#  id                :bigint           not null, primary key
#  dice_count        :integer
#  dice_value        :integer
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  class_specific_id :bigint           not null
#
# Indexes
#
#  index_martial_arts_on_class_specific_id  (class_specific_id)
#
# Foreign Keys
#
#  fk_rails_...  (class_specific_id => class_specifics.id)
#
FactoryBot.define do
  factory :sneak_attack do
    dice_count { 1 }
    dice_value { 1 }
    class_specific { nil }
  end
end
