# == Schema Information
#
# Table name: api_references
#
#  id           :bigint           not null, primary key
#  api_url      :string
#  name         :string
#  slug         :string
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  equipment_id :bigint
#
# Indexes
#
#  index_api_references_on_equipment_id  (equipment_id)
#
require 'rails_helper'

RSpec.describe ApiReference, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
