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

class Prof < ApplicationRecord
end
