# == Schema Information
#
# Table name: class_level_choices
#
#  id               :bigint           not null, primary key
#  choices          :string           default([]), is an Array
#  name             :string
#  num_choices      :integer
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  class_feature_id :bigint           not null
#
# Indexes
#
#  index_class_level_choices_on_class_feature_id  (class_feature_id)
#
# Foreign Keys
#
#  fk_rails_...  (class_feature_id => class_features.id)
#
require 'rails_helper'

RSpec.describe ClassLevelChoice, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
