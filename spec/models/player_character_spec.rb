# == Schema Information
#
# Table name: player_characters
#
#  id          :bigint           not null, primary key
#  description :text
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#  user_id     :bigint
#
# Indexes
#
#  index_player_characters_on_user_id  (user_id)
#

require 'rails_helper'

RSpec.describe PlayerCharacter, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
