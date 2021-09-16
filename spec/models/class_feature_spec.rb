# == Schema Information
#
# Table name: class_features
#
#  id                 :bigint           not null, primary key
#  desc               :string           default([]), is an Array
#  level              :integer
#  name               :string
#  reference          :string
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  dnd_class_level_id :bigint           not null
#
# Indexes
#
#  index_class_features_on_dnd_class_level_id  (dnd_class_level_id)
#
# Foreign Keys
#
#  fk_rails_...  (dnd_class_level_id => dnd_class_levels.id)
#
require 'rails_helper'

RSpec.describe ClassFeature, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
