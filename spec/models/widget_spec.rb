# == Schema Information
#
# Table name: widgets
#
#  id         :bigint           not null, primary key
#  content    :text
#  icon       :text
#  subtitle   :text
#  title      :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  user_id    :bigint
#
# Indexes
#
#  index_widgets_on_user_id  (user_id)
#
require 'rails_helper'

RSpec.describe Widget, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
