# == Schema Information
#
# Table name: prerequisites
#
#  widgetId               :bigint           not null, primary key
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
#  fk_rails_...  (class_feature_id => class_features.widgetId)
#
class Prerequisite < ApplicationRecord
  belongs_to :class_feature
end
