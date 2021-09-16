# == Schema Information
#
# Table name: dnd_class_levels
#
#  id                    :bigint           not null, primary key
#  ability_score_bonuses :integer
#  level                 :integer
#  prof_bonus            :integer
#  created_at            :datetime         not null
#  updated_at            :datetime         not null
#  dnd_class_id          :bigint           not null
#
# Indexes
#
#  index_dnd_class_levels_on_dnd_class_id  (dnd_class_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_id => dnd_classes.id)
#
require 'rails_helper'

RSpec.describe DndClassLevel, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
