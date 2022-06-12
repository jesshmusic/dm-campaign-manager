# == Schema Information
#
# Table name: skills
#
#  widgetId            :bigint           not null, primary key
#  ability_score :string
#  desc          :string
#  name          :string
#  slug          :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_skills_on_slug  (slug) UNIQUE
#
require 'rails_helper'

RSpec.describe Skill, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
