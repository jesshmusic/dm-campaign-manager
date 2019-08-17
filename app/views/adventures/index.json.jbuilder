# frozen_string_literal: true

json.array! @adventures, partial: 'adventures/adventure', as: :adventure
