# frozen_string_literal: true
#
json.count @dnd_classes.count
json.results do
  json.array! @dnd_classes, partial: 'admin/v1/dnd_classes/dnd_class_summary', as: :dnd_class
end
