# == Schema Information
#
# Table name: sneak_attacks
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
#  index_sneak_attacks_on_class_specific_id  (class_specific_id)
#
# Foreign Keys
#
#  fk_rails_...  (class_specific_id => class_specifics.id)
#
class SneakAttack < ApplicationRecord
  belongs_to :class_specific
end
