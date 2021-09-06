# == Schema Information
#
# Table name: api_references
#
#  id         :bigint           not null, primary key
#  api_url    :string
#  name       :string
#  slug       :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
require 'rails_helper'

RSpec.describe ApiReference, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
