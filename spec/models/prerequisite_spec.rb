# == Schema Information
#
# Table name: prerequisites
#
#  id               :bigint           not null, primary key
#  level            :integer
#  name             :string
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  class_feature_id :bigint           not null
#
# Indexes
#
#  index_prerequisites_on_class_feature_id  (class_feature_id)
#
# Foreign Keys
#
#  fk_rails_...  (class_feature_id => class_features.id)
#
require 'rails_helper'

RSpec.describe Prerequisite, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
