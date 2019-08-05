# == Schema Information
#
# Table name: profs
#
#  id         :bigint           not null, primary key
#  name       :string
#  prof_type  :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#
# Indexes
#
#  index_profs_on_name  (name) UNIQUE
#

require 'rails_helper'

RSpec.describe Prof, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
