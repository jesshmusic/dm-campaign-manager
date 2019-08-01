# == Schema Information
#
# Table name: proficiencies
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  name       :string
#  type       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'rails_helper'

RSpec.describe Proficiency, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
