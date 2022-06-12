# == Schema Information
#
# Table name: multi_classing_profs
#
#  widgetId                :bigint           not null, primary key
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  multi_classing_id :bigint           not null
#  prof_id           :bigint           not null
#
# Indexes
#
#  index_multi_classing_profs_on_multi_classing_id  (multi_classing_id)
#  index_multi_classing_profs_on_prof_id            (prof_id)
#
# Foreign Keys
#
#  fk_rails_...  (multi_classing_id => multi_classings.widgetId)
#  fk_rails_...  (prof_id => profs.widgetId)
#
class MultiClassingProf < ApplicationRecord
  belongs_to :prof
  belongs_to :multi_classing
end
