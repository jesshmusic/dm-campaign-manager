# frozen_string_literal: true

json.array! @adventures, partial: 'admin/v1/adventures/adventure', as: :adventure
