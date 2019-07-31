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

class Campaign < ApplicationRecord
  belongs_to :user
end
