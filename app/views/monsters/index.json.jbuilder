# frozen_string_literal: true

json.array! @monsters, partial: 'monsters/monster', as: :monster
