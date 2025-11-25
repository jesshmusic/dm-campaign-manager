# frozen_string_literal: true

json.count @sections.count
json.results do
  json.array! @sections, partial: 'admin/v1/sections/section_summary', as: :section
end
