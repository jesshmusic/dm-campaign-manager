# == Schema Information
#
# Table name: campaigns
#
#  id          :bigint           not null, primary key
#  user_id     :bigint
#  name        :text
#  description :text
#  world       :text
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#

require 'rails_helper'

RSpec.describe Campaign, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
