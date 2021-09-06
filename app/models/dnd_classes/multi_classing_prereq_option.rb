# == Schema Information
#
# Table name: multi_classing_prereq_options
#
#  id                :bigint           not null, primary key
#  choose            :integer
#  type              :string
#  created_at        :datetime         not null
#  updated_at        :datetime         not null
#  multi_classing_id :bigint           not null
#
# Indexes
#
#  index_multi_classing_prereq_options_on_multi_classing_id  (multi_classing_id)
#
# Foreign Keys
#
#  fk_rails_...  (multi_classing_id => multi_classings.id)
#
class MultiClassingPrereqOption < ApplicationRecord
  belongs_to :multi_classing

  has_many :multi_class_prereqs, dependent: :destroy
end
