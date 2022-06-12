# == Schema Information
#
# Table name: sections
#
#  widgetId          :bigint           not null, primary key
#  description :string
#  name        :string
#  slug        :string
#  created_at  :datetime         not null
#  updated_at  :datetime         not null
#
# Indexes
#
#  index_sections_on_slug  (slug) UNIQUE
#
require 'rails_helper'

RSpec.describe Section, type: :model do
  pending "add some examples to (or delete) #{__FILE__}"
end
