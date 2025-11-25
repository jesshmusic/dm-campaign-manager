json.count @widgets.count
json.widgets do
  json.array! @widgets, partial: 'admin/v1/widgets/widget', as: :widget
end
