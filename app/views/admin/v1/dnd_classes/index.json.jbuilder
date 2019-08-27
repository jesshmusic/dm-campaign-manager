# frozen_string_literal: true

json.array! @dnd_classes, partial: 'admin/v1/dnd_classes/dnd_class', as: :dnd_class
