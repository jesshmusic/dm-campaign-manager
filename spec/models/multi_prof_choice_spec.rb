# == Schema Information
#
# Table name: multi_prof_choices
#
#  id                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  multi_classing_id :bigint           not null
#  prof_id           :bigint           not null
#
# Indexes
#
#  index_multi_prof_choices_on_multi_classing_id  (multi_classing_id)
#  index_multi_prof_choices_on_prof_id            (prof_id)
#
# Foreign Keys
#
#  fk_rails_...  (multi_classing_id => multi_classings.id)
#  fk_rails_...  (prof_id => profs.id)
#
require 'rails_helper'

RSpec.describe MultiProfChoice, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
