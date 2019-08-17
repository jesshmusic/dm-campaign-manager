# frozen_string_literal: true

json.array! @spells, partial: 'spells/spell', as: :spell
