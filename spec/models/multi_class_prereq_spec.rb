# == Schema Information
#
# Table name: multi_class_prereqs
#
#  id                              :bigint           not null, primary key
#  ability_score                   :string
#  minimum_score                   :integer
#  created_at                      :datetime         not null
#  updated_at                      :datetime         not null
#  multi_classing_id               :bigint
#  multi_classing_prereq_option_id :bigint
#
# Indexes
#
#  index_multi_class_prereqs_on_multi_classing_id                (multi_classing_id)
#  index_multi_class_prereqs_on_multi_classing_prereq_option_id  (multi_classing_prereq_option_id)
#
require 'rails_helper'

RSpec.describe MultiClassPrereq, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
