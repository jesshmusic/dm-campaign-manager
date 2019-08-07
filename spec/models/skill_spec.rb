# == Schema Information
#
# Table name: skills
#
#  id         :bigint           not null, primary key
#  name       :string
#  score      :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  monster_id :bigint
#
# Indexes
#
#  index_skills_on_monster_id  (monster_id)
#

require 'rails_helper'

RSpec.describe Skill, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
