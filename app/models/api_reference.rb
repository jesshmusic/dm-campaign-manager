# == Schema Information
#
# Table name: api_references
#
#  widgetId           :bigint           not null, primary key
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
#  index_api_references_on_slug          (slug) UNIQUE
#
class ApiReference < ApplicationRecord
  belongs_to :equipment, optional: true
end
