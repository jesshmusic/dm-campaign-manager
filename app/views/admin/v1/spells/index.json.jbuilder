# frozen_string_literal: true

json.array! @spells, partial: 'admin/v1/spells/spell', as: :spell
